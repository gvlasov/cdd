package com.github.chriego.cdd.jetbrains.startup;

import com.intellij.openapi.options.Configurable;
import com.intellij.openapi.options.ConfigurableProvider;
import com.intellij.openapi.project.Project;
import org.jetbrains.annotations.NotNull;

public final class CddStartupTasksConfigurableProvider extends ConfigurableProvider {
    private final Project project;

    public CddStartupTasksConfigurableProvider(@NotNull Project project) {
        this.project = project;
    }

    @Override
    public @NotNull Configurable createConfigurable() {
        return new CddStartupTasksConfigurable(project);
    }

    @Override
    public boolean canCreateConfigurable() {
        return !project.isDefault();
    }
}
