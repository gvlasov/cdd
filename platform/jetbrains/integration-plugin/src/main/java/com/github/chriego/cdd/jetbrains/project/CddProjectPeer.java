package com.github.chriego.cdd.jetbrains.project;

import com.intellij.ide.util.projectWizard.SettingsStep;
import com.intellij.openapi.ui.ValidationInfo;
import com.intellij.platform.ProjectGeneratorPeer;
import com.intellij.ui.components.JBTextField;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.JComponent;
import java.util.ArrayList;
import java.util.List;

public final class CddProjectPeer implements ProjectGeneratorPeer<CddProjectSettings> {
    private final JBTextField originRemoteUrlField = new JBTextField();
    private final List<SettingsListener> listeners = new ArrayList<>();

    @Override
    public void buildUI(@NotNull SettingsStep settingsStep) {
        originRemoteUrlField.getEmptyText().setText("git@github.com:org/repo.git");
        originRemoteUrlField.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            @Override
            public void insertUpdate(javax.swing.event.DocumentEvent event) {
                notifySettingsChanged();
            }

            @Override
            public void removeUpdate(javax.swing.event.DocumentEvent event) {
                notifySettingsChanged();
            }

            @Override
            public void changedUpdate(javax.swing.event.DocumentEvent event) {
                notifySettingsChanged();
            }
        });

        settingsStep.addSettingsField("Git origin remote URL", originRemoteUrlField);
    }

    @Override
    public @NotNull CddProjectSettings getSettings() {
        return new CddProjectSettings(originRemoteUrlField.getText());
    }

    @Override
    public @Nullable ValidationInfo validate() {
        String originRemoteUrl = getSettings().originRemoteUrl();
        if (originRemoteUrl.isEmpty() || isGithubRemote(originRemoteUrl)) {
            return null;
        }

        return new ValidationInfo("Use a GitHub SSH or HTTPS URL, or leave the field empty.", originRemoteUrlField);
    }

    @Override
    public boolean isBackgroundJobRunning() {
        return false;
    }

    @Override
    public void addSettingsListener(@NotNull SettingsListener listener) {
        listeners.add(listener);
    }

    @Override
    public @NotNull JComponent getComponent() {
        return originRemoteUrlField;
    }

    private void notifySettingsChanged() {
        for (SettingsListener listener : listeners) {
            listener.stateChanged(true);
        }
    }

    private static boolean isGithubRemote(@NotNull String value) {
        return value.matches("git@github\\.com:.+")
                || value.matches("https://github\\.com/.+")
                || value.matches("ssh://git@github\\.com/.+");
    }
}
