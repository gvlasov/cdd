package com.github.chriego.cdd.jetbrains.project;

import com.intellij.ide.util.projectWizard.WizardContext;
import com.intellij.platform.ProjectTemplate;
import com.intellij.platform.ProjectTemplatesFactory;
import org.jetbrains.annotations.NotNull;

public final class CddProjectTemplatesFactory extends ProjectTemplatesFactory {
    @Override
    public String @NotNull [] getGroups() {
        return new String[]{CddProjectTemplate.GROUP};
    }

    @Override
    public ProjectTemplate @NotNull [] createTemplates(@NotNull String group, @NotNull WizardContext context) {
        if (!CddProjectTemplate.GROUP.equals(group)) {
            return ProjectTemplate.EMPTY_ARRAY;
        }

        return new ProjectTemplate[]{new CddProjectTemplate()};
    }
}
