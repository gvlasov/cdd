package com.github.chriego.cdd.jetbrains.symlinks;

import com.intellij.ide.dnd.FileCopyPasteUtil;
import com.intellij.notification.NotificationGroupManager;
import com.intellij.notification.NotificationType;
import com.intellij.openapi.actionSystem.ActionUpdateThread;
import com.intellij.openapi.actionSystem.AnAction;
import com.intellij.openapi.actionSystem.AnActionEvent;
import com.intellij.openapi.actionSystem.CommonDataKeys;
import com.intellij.openapi.application.ApplicationManager;
import com.intellij.openapi.fileChooser.FileChooser;
import com.intellij.openapi.fileChooser.FileChooserDescriptor;
import com.intellij.openapi.fileChooser.FileChooserDescriptorFactory;
import com.intellij.openapi.ide.CopyPasteManager;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.project.ProjectUtil;
import com.intellij.openapi.vfs.LocalFileSystem;
import com.intellij.openapi.vfs.VirtualFile;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.awt.datatransfer.Transferable;
import java.io.IOException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public final class PasteAsSymlinkAction extends AnAction {
    private static final String NOTIFICATION_GROUP = "CDD Integration";

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
        List<Path> sources = copiedFiles();

        if (project == null) {
            return;
        }

        if (sources.isEmpty()) {
            notify(project, NotificationType.WARNING, "Symlink source not selected; copy the source file to select it");
            return;
        }

        VirtualFile destination = destinationDirectory(event);
        if (destination == null) {
            destination = chooseDestinationDirectory(project, initialDirectory(event, project));
        }

        if (destination == null) {
            return;
        }

        Path destinationPath = destination.toNioPath();

        ApplicationManager.getApplication().executeOnPooledThread(() -> {
            List<Path> createdLinks = new ArrayList<>();
            List<String> failures = new ArrayList<>();

            for (Path source : sources) {
                Path link = destinationPath.resolve(source.getFileName());

                try {
                    Files.createSymbolicLink(link, source);
                    createdLinks.add(link);
                } catch (FileAlreadyExistsException exception) {
                    failures.add(link.getFileName()+" already exists");
                } catch (UnsupportedOperationException exception) {
                    failures.add("symbolic links are not supported here");
                } catch (IOException | SecurityException exception) {
                    failures.add(link.getFileName()+": "+exception.getMessage());
                }
            }

            if (!createdLinks.isEmpty()) {
                LocalFileSystem.getInstance().refreshNioFiles(createdLinks);
            }

            if (failures.isEmpty()) {
                notify(project, NotificationType.INFORMATION, "Created "+createdLinks.size()+" symlink"+plural(createdLinks.size())+".");
            } else {
                notify(project, NotificationType.WARNING, "Created "+createdLinks.size()+" symlink"+plural(createdLinks.size())+". Failed: "+String.join("; ", failures));
            }
        });
    }

    private static @Nullable VirtualFile destinationDirectory(@NotNull AnActionEvent event) {
        VirtualFile selectedFile = event.getData(CommonDataKeys.VIRTUAL_FILE);

        if (selectedFile == null) {
            return null;
        }

        return selectedFile.isDirectory() ? selectedFile : null;
    }

    private static @Nullable VirtualFile initialDirectory(@NotNull AnActionEvent event, @NotNull Project project) {
        VirtualFile selectedFile = event.getData(CommonDataKeys.VIRTUAL_FILE);

        if (selectedFile != null) {
            return selectedFile.isDirectory() ? selectedFile : selectedFile.getParent();
        }

        return ProjectUtil.guessProjectDir(project);
    }

    private static @Nullable VirtualFile chooseDestinationDirectory(@NotNull Project project, @Nullable VirtualFile initialDirectory) {
        FileChooserDescriptor descriptor = FileChooserDescriptorFactory.createSingleFolderDescriptor()
                .withTitle("Paste as Symlink")
                .withDescription("Choose the directory where symbolic links should be created.");

        return FileChooser.chooseFile(descriptor, project, initialDirectory);
    }

    private static List<Path> copiedFiles() {
        Transferable contents = CopyPasteManager.getInstance().getContents();

        if (contents == null || !FileCopyPasteUtil.isFileListFlavorAvailable(contents.getTransferDataFlavors())) {
            return List.of();
        }

        return FileCopyPasteUtil.getFiles(contents);
    }

    private static String plural(int count) {
        return count == 1 ? "" : "s";
    }

    private static void notify(@NotNull Project project, @NotNull NotificationType type, @NotNull String content) {
        NotificationGroupManager.getInstance()
                .getNotificationGroup(NOTIFICATION_GROUP)
                .createNotification(content, type)
                .notify(project);
    }
}
