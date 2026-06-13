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
import com.github.chriego.cdd.jetbrains.directories.CddProjectDirectories;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.List;

public final class CddScopesProvider implements CustomScopesProvider {
    private static final NamedScope CDD_SCOPE = new NamedScope("CDD", new CddPackageSet());

    @Override
    public @NotNull List<NamedScope> getCustomScopes() {
        return List.of(CDD_SCOPE);
    }

    private static final class CddPackageSet extends AbstractPackageSet {
        private CddPackageSet() {
            super("CDD");
        }

        @Override
        public boolean contains(@NotNull VirtualFile file, @NotNull Project project, @Nullable NamedScopesHolder holder) {
            List<String> cddRoots = List.copyOf(CddProjectDirectories.loadTopLevelRoots());
            for (VirtualFile contentRoot : ProjectRootManager.getInstance(project).getContentRoots()) {
                if (isCddFile(file, contentRoot, cddRoots)) {
                    return true;
                }
            }

            VirtualFile baseDir = ProjectUtil.guessProjectDir(project);
            return baseDir != null && isCddFile(file, baseDir, cddRoots);
        }

        private static boolean isCddFile(@NotNull VirtualFile file, @NotNull VirtualFile projectRoot, @NotNull List<String> cddRoots) {
            return isRootReadme(file, projectRoot) || isInsideCddRoot(file, projectRoot, cddRoots);
        }

        private static boolean isRootReadme(@NotNull VirtualFile file, @NotNull VirtualFile projectRoot) {
            VirtualFile readme = projectRoot.findChild("README.md");
            return readme != null && readme.equals(file);
        }

        private static boolean isInsideCddRoot(@NotNull VirtualFile file, @NotNull VirtualFile projectRoot, @NotNull List<String> cddRoots) {
            for (String rootName : cddRoots) {
                VirtualFile cddRoot = projectRoot.findChild(rootName);
                if (cddRoot != null && VfsUtilCore.isAncestor(cddRoot, file, false)) {
                    return true;
                }
            }

            return false;
        }
    }
}
