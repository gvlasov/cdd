package com.github.chriego.cdd.jetbrains.directories;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class CddProjectDirectories {
    private static final String DIRECTORIES_FILE = "concepts/project-directories/directories-list.json";
    private static final List<String> FALLBACK_DIRECTORIES = List.of(
            "concepts",
            "project",
            "stakeholders",
            "processes",
            "platform",
            "commands",
            "envs",
            "plans",
            "plans/problems",
            "plans/features",
            "plans/finished",
            "sandbox"
    );
    private static final Pattern DIRECTORY_PATTERN = Pattern.compile("\"([^\"]+)\"");

    private CddProjectDirectories() {
    }

    public static @NotNull List<String> loadAll() {
        List<String> directories = loadFromResource();
        if (!directories.isEmpty()) {
            return directories;
        }

        return FALLBACK_DIRECTORIES;
    }

    public static @NotNull Set<String> loadTopLevelRoots() {
        Set<String> roots = new LinkedHashSet<>();
        for (String directory : loadAll()) {
            roots.add(topLevelRoot(directory));
        }
        return roots;
    }

    private static @NotNull List<String> loadFromResource() {
        try (InputStream inputStream = CddProjectDirectories.class.getClassLoader().getResourceAsStream(DIRECTORIES_FILE)) {
            if (inputStream == null) {
                return List.of();
            }

            String text = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            return parse(text);
        } catch (IOException exception) {
            return List.of();
        }
    }

    private static @NotNull List<String> parse(@NotNull String text) {
        Matcher matcher = DIRECTORY_PATTERN.matcher(text);
        Set<String> directories = new LinkedHashSet<>();
        while (matcher.find()) {
            directories.add(matcher.group(1));
        }

        return new ArrayList<>(directories);
    }

    private static @NotNull String topLevelRoot(@NotNull String directory) {
        int slashIndex = directory.indexOf('/');
        if (slashIndex < 0) {
            return directory;
        }

        return directory.substring(0, slashIndex);
    }
}
