package com.github.chriego.cdd.jetbrains.plans;

import com.intellij.openapi.actionSystem.ActionUpdateThread;
import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.command.WriteCommandAction;
import com.intellij.openapi.fileEditor.FileEditorManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.ui.Messages;
import com.intellij.openapi.vfs.LocalFileSystem;
import com.intellij.openapi.vfs.VirtualFile;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;

abstract class CreatePlanAction extends AnAction {
    private final String planKind;
    private final String dialogTitle;
    private final String prompt;
    private final String templateHeading;
    private final String[] templateSections;

    protected CreatePlanAction(
            @NotNull String actionText,
            @NotNull String actionDescription,
            @NotNull String planKind,
            @NotNull String dialogTitle,
            @NotNull String prompt,
            @NotNull String templateHeading,
            @NotNull String... templateSections
    ) {
        super(actionText, actionDescription, null);
        this.planKind = planKind;
        this.dialogTitle = dialogTitle;
        this.prompt = prompt;
        this.templateHeading = templateHeading;
        this.templateSections = templateSections;
    }

    @Override
    public @NotNull ActionUpdateThread getActionUpdateThread() {
        return ActionUpdateThread.BGT;
    }

    @Override
    public void update(@NotNull AnActionEvent event) {
        event.getPresentation().setEnabledAndVisible(event.getProject() != null);
    }

    @Override
    public void actionPerformed(@NotNull AnActionEvent event) {
        Project project = event.getProject();
        if (project == null) {
            return;
        }

        String rawTitle = Messages.showInputDialog(project, prompt, dialogTitle, Messages.getQuestionIcon());
        if (rawTitle == null) {
            return;
        }

        final String title = rawTitle.trim();
        if (title.isEmpty()) {
            Messages.showErrorDialog(project, "Plan title cannot be empty.", dialogTitle);
            return;
        }

        Path projectRoot = projectRoot(project);
        if (projectRoot == null) {
            Messages.showErrorDialog(project, "Project root is not available.", dialogTitle);
            return;
        }

        Path planDirectory = projectRoot.resolve("plans").resolve(planKind + "s");
        String fileName = slugify(title) + ".md";
        if (fileName.equals(".md")) {
            Messages.showErrorDialog(project, "Plan title must contain at least one letter or digit.", dialogTitle);
            return;
        }

        Path planFile = planDirectory.resolve(fileName);

        WriteCommandAction.runWriteCommandAction(project, () -> {
            try {
                Files.createDirectories(planDirectory);
                if (Files.notExists(planFile)) {
                    Files.writeString(planFile, renderTemplate(title), StandardCharsets.UTF_8);
                }
            } catch (IOException exception) {
                throw new RuntimeException(exception);
            }
        });

        VirtualFile virtualFile = LocalFileSystem.getInstance().refreshAndFindFileByNioFile(planFile);
        if (virtualFile == null) {
            Messages.showErrorDialog(project, "Could not open plan file: " + planFile, dialogTitle);
            return;
        }

        FileEditorManager.getInstance(project).openFile(virtualFile, true);
    }

    private @Nullable Path projectRoot(@NotNull Project project) {
        String basePath = project.getBasePath();
        if (basePath == null) {
            return null;
        }

        return Path.of(basePath).toAbsolutePath().normalize();
    }

    private @NotNull String renderTemplate(@NotNull String title) {
        StringBuilder content = new StringBuilder();
        content.append("# ").append(title).append("\n\n");
        content.append(templateHeading).append("\n\n");
        for (String section : templateSections) {
            content.append(section).append("\n\n");
        }
        return content.toString();
    }

    private static @NotNull String slugify(@NotNull String value) {
        String slug = value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-");
        slug = slug.replaceAll("^-+", "");
        slug = slug.replaceAll("-+$", "");
        return slug;
    }
}
