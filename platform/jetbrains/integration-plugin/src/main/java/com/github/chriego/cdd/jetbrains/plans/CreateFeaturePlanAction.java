package com.github.chriego.cdd.jetbrains.plans;

public final class CreateFeaturePlanAction extends CreatePlanAction {
    public CreateFeaturePlanAction() {
        super(
                "New Feature Plan",
                "Create a feature plan in plans/features",
                "feature",
                "New Feature Plan",
                "Feature plan title:",
                "## Feature",
                "Describe the feature you want to build.",
                "## Value",
                "Describe why the feature matters.",
                "## Notes"
        );
    }
}
