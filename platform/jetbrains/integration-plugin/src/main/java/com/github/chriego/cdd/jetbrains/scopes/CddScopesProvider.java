package com.github.chriego.cdd.jetbrains.scopes;

import com.intellij.openapi.project.Project;
import com.intellij.openapi.project.ProjectUtil;
import com.intellij.openapi.roots.ProjectRootManager;
import com.intellij.openapi.vfs.VfsUtilCore;
import com.intellij.openapi.vfs.VirtualFile;
import com.intellij.psi.search.scope.packageSet.AbstractPackageSet;
import com.intellij.psi.search.scope.packageSet.CustomScopesProvider;
import com.intellij.psi.search.scope.packageSet.NamedScope;
import com.intellij.psi.search.scope.packageSet.NamedScopesHolder;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.List;
import java.util.Set;

public final class CddScopesProvider implements CustomScopesProvider {
    private static final NamedScope CDD_SCOPE = new NamedScope("CDD", new CddPackageSet());

    @Override
    public @NotNull List<NamedScope> getCustomScopes() {
        return List.of(CDD_SCOPE);
    }

    private static final class CddPackageSet extends AbstractPackageSet {
        private static final Set<String> CDD_ROOTS = Set.of(
                "concepts",
                "stakeholders",
                "processes",
                "platform"
        );

        private CddPackageSet() {
            super("CDD");
        }

        @Override
        public boolean contains(@NotNull VirtualFile file, @NotNull Project project, @Nullable NamedScopesHolder holder) {
            for (VirtualFile contentRoot : ProjectRootManager.getInstance(project).getContentRoots()) {
                if (isCddFile(file, contentRoot)) {
                    return true;
                }
            }

            VirtualFile baseDir = ProjectUtil.guessProjectDir(project);
            return baseDir != null && isCddFile(file, baseDir);
        }

        private static boolean isCddFile(@NotNull VirtualFile file, @NotNull VirtualFile projectRoot) {
            return isRootReadme(file, projectRoot) || isInsideCddRoot(file, projectRoot);
        }

        private static boolean isRootReadme(@NotNull VirtualFile file, @NotNull VirtualFile projectRoot) {
            VirtualFile readme = projectRoot.findChild("README.md");
            return readme != null && readme.equals(file);
        }

        private static boolean isInsideCddRoot(@NotNull VirtualFile file, @NotNull VirtualFile projectRoot) {
            for (String rootName : CDD_ROOTS) {
                VirtualFile cddRoot = projectRoot.findChild(rootName);
                if (cddRoot != null && VfsUtilCore.isAncestor(cddRoot, file, false)) {
                    return true;
                }
            }

            return false;
        }
    }
}
