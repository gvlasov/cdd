package com.github.chriego.cdd.jetbrains.plans;

public final class CreateProblemPlanAction extends CreatePlanAction {
    public CreateProblemPlanAction() {
        super(
                "New Problem Plan",
                "Create a problem plan in plans/problems",
                "problem",
                "New Problem Plan",
                "Problem plan title:",
                "## Problem",
                "Describe the problem you are trying to solve.",
                "## Impact",
                "Describe who is affected and how.",
                "## Desired outcome"
        );
    }
}
