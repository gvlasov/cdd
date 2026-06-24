package com.github.chriego.cdd.jetbrains.project;

import com.intellij.ide.util.projectWizard.WebTemplateNewProjectWizard;
import com.intellij.ide.wizard.GeneratorNewProjectWizardBuilderAdapter;

public final class CddProjectModuleBuilder extends GeneratorNewProjectWizardBuilderAdapter {
    public CddProjectModuleBuilder() {
        super(new WebTemplateNewProjectWizard(new CddProjectTemplate()));
    }

    @Override
    public boolean isAvailable() {
        return true;
    }
}
