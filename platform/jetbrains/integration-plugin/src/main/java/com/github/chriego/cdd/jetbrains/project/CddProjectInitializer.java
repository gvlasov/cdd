package com.github.chriego.cdd.jetbrains.project;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

public final class CddProjectInitializer {
    private CddProjectInitializer() {
    }

    public static void initialize(@NotNull Path projectPath, @NotNull String originUrl) throws IOException, InterruptedException {
        List<String> command = new ArrayList<>();
        command.add("cdd");
        command.add("init");
        command.add(projectPath.toString());
        if (!originUrl.isBlank()) {
            command.add(originUrl);
        }

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        Path parent = projectPath.getParent();
        if (parent != null && Files.isDirectory(parent)) {
            processBuilder.directory(parent.toFile());
        }
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        String output;
        try (InputStream stream = process.getInputStream()) {
            output = new String(stream.readAllBytes(), StandardCharsets.UTF_8);
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new IllegalStateException(formatFailure(exitCode, output));
        }
    }

    private static @NotNull String formatFailure(int exitCode, @NotNull String output) {
        StringBuilder message = new StringBuilder("cdd init failed with exit code ").append(exitCode);
        if (!output.isBlank()) {
            message.append(":\n").append(output.trim());
        }
        return message.toString();
    }
}
