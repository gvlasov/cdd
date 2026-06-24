package com.github.chriego.cdd.jetbrains.project;

import com.intellij.icons.AllIcons;
import com.intellij.ide.util.projectWizard.WebProjectTemplate;
import com.intellij.openapi.module.Module;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.ui.ValidationInfo;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.platform.ProjectGeneratorPeer;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.Icon;
import java.nio.file.Path;

public final class CddProjectTemplate extends WebProjectTemplate<CddProjectSettings> {
    public static final String GROUP = "CDD";
    private static final String ID = "cdd-project";
    private static final String NAME = "CDD Project";
    private static final String DESCRIPTION = "Initialize a Concept-Driven Design project and optionally set the git origin remote.";

    @Override
    public @NotNull String getId() {
        return ID;
    }

    @Override
    public @NotNull String getName() {
        return NAME;
    }

    @Override
    public @NotNull String getDescription() {
        return DESCRIPTION;
    }

    @Override
    public @NotNull Icon getIcon() {
        return AllIcons.Nodes.Module;
    }

    @Override
    public @NotNull Icon getLogo() {
        return getIcon();
    }

    @Override
    public @NotNull ProjectGeneratorPeer<CddProjectSettings> createPeer() {
        return new CddProjectPeer();
    }

    @Override
    public @Nullable ValidationInfo validateSettings() {
        return null;
    }

    @Override
    public void generateProject(@NotNull Project project, @NotNull VirtualFile baseDir, @NotNull CddProjectSettings settings, @NotNull Module module) {
        try {
            CddProjectInitializer.initialize(Path.of(baseDir.getPath()), settings.originRemoteUrl());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("CDD project initialization was interrupted.", exception);
        } catch (Exception exception) {
            throw new RuntimeException("Could not initialize the CDD project: " + exception.getMessage(), exception);
        }
    }
}
