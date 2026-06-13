package com.github.chriego.cdd.jetbrains.startup;

import com.intellij.execution.RunnerAndConfigurationSettings;
import com.intellij.execution.configurations.RunConfiguration;
import com.intellij.execution.configurations.ConfigurationFactory;
import com.intellij.execution.configurations.ConfigurationType;
import com.intellij.execution.impl.RunManagerImpl;
import com.intellij.openapi.options.Configurable;
import com.intellij.openapi.options.SearchableConfigurable;
import com.intellij.openapi.project.Project;
import com.intellij.openapi.ui.Messages;
import com.intellij.ui.components.JBLabel;
import com.intellij.ui.components.JBPanel;
import com.intellij.util.ui.JBUI;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import javax.swing.JButton;
import javax.swing.JComponent;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import javax.swing.border.TitledBorder;
import java.awt.BorderLayout;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.file.Path;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;

public final class CddStartupTasksConfigurable implements SearchableConfigurable, Configurable.NoScroll {
    private static final String ID = "cdd.startup.tasks";
    private static final String HELP_TOPIC = "reference.settings.startup.tasks";
    private static final String SHELL_SCRIPT_TYPE_NAME = "Shell Script";
    private static final String UP_TASK_NAME = "CDD: up";
    private static final String OPEN_IN_BROWSER_TASK_NAME = "CDD: open-in-browser";

    private final Project project;

    private JPanel rootPanel;
    private JButton upButton;
    private JButton openInBrowserButton;
    private JBLabel statusLabel;

    public CddStartupTasksConfigurable(@NotNull Project project) {
        this.project = project;
    }

    @Override
    public @NotNull String getId() {
        return ID;
    }

    @Override
    public @NotNull String getDisplayName() {
        return "CDD";
    }

    @Override
    public @Nullable String getHelpTopic() {
        return HELP_TOPIC;
    }

    @Override
    public @NotNull JComponent createComponent() {
        if (rootPanel == null) {
            rootPanel = buildPanel();
        }

        refreshButtonState();
        return rootPanel;
    }

    @Override
    public boolean isModified() {
        return false;
    }

    @Override
    public void apply() {
    }

    @Override
    public void reset() {
        refreshButtonState();
    }

    private JPanel buildPanel() {
        JBPanel<?> content = new JBPanel<>(new BorderLayout(0, JBUI.scale(12)));
        content.setBorder(JBUI.Borders.empty(16));

        JPanel card = new JBPanel<>(new BorderLayout(0, JBUI.scale(12)));
        card.setBorder(new TitledBorder("CDD"));

        statusLabel = new JBLabel("Add the common startup shell tasks used by CDD projects.");
        statusLabel.setFont(statusLabel.getFont().deriveFont(Font.PLAIN));
        statusLabel.setAllowAutoWrapping(true);
        card.add(statusLabel, BorderLayout.NORTH);

        JPanel buttons = new JBPanel<>(new GridLayout(2, 1, 0, JBUI.scale(8)));
        upButton = new JButton("Add up");
        upButton.addActionListener(event -> addTask(new StartupTaskSpec(UP_TASK_NAME, "commands/up")));
        buttons.add(upButton);

        openInBrowserButton = new JButton("Add open-in-browser");
        openInBrowserButton.addActionListener(event -> addTask(new StartupTaskSpec(OPEN_IN_BROWSER_TASK_NAME, "commands/open-in-browser")));
        buttons.add(openInBrowserButton);

        JPanel buttonRow = new JBPanel<>(new FlowLayout(FlowLayout.LEFT, JBUI.scale(8), 0));
        buttonRow.add(buttons);
        card.add(buttonRow, BorderLayout.CENTER);

        content.add(card, BorderLayout.NORTH);
        return content;
    }

    private void addTask(@NotNull StartupTaskSpec task) {
        try {
            CddStartupTaskManagerBridge bridge = new CddStartupTaskManagerBridge(project);
            if (bridge.isTaskInstalled(task)) {
                refreshButtonState();
                return;
            }

            RunnerAndConfigurationSettings settings = bridge.ensureStartupTaskConfiguration(task);
            bridge.addStartupTask(settings);
            refreshButtonState();
        } catch (ReflectiveOperationException exception) {
            Messages.showErrorDialog(project, "Could not add the CDD startup task:\n" + exception.getMessage(), "CDD Startup Tasks");
        } catch (RuntimeException exception) {
            Messages.showErrorDialog(project, "Could not add the CDD startup task:\n" + exception.getMessage(), "CDD Startup Tasks");
        }
    }

    private void refreshButtonState() {
        if (upButton == null || openInBrowserButton == null) {
            return;
        }

        try {
            CddStartupTaskManagerBridge bridge = new CddStartupTaskManagerBridge(project);
            upButton.setEnabled(!bridge.isTaskInstalled(new StartupTaskSpec(UP_TASK_NAME, "commands/up")));
            openInBrowserButton.setEnabled(!bridge.isTaskInstalled(new StartupTaskSpec(OPEN_IN_BROWSER_TASK_NAME, "commands/open-in-browser")));
            statusLabel.setText("Add the common startup shell tasks used by CDD projects.");
        } catch (ReflectiveOperationException exception) {
            upButton.setEnabled(false);
            openInBrowserButton.setEnabled(false);
            statusLabel.setText("Startup task support is unavailable in this IDE build.");
        }
    }

    private static final class StartupTaskSpec {
        private final String name;
        private final String relativeCommandPath;

        private StartupTaskSpec(@NotNull String name, @NotNull String relativeCommandPath) {
            this.name = name;
            this.relativeCommandPath = relativeCommandPath;
        }
    }

    private static final class CddStartupTaskManagerBridge {
        private final Project project;
        private final Path projectRoot;
        private final Object startupManager;
        private final Method getSharedConfigurations;
        private final Method getLocalConfigurations;
        private final Method setStartupConfigurations;

        private CddStartupTaskManagerBridge(@NotNull Project project) throws ReflectiveOperationException {
            this.project = project;
            String basePath = project.getBasePath();
            if (basePath == null) {
                throw new IllegalStateException("project base path is not available");
            }

            this.projectRoot = Path.of(basePath).toAbsolutePath().normalize();

            Class<?> managerClass = Class.forName("com.intellij.execution.startup.ProjectStartupTaskManager");
            Method getInstance = managerClass.getDeclaredMethod("getInstance", Project.class);
            getInstance.setAccessible(true);
            this.startupManager = getInstance.invoke(null, project);

            this.getSharedConfigurations = managerClass.getDeclaredMethod("getSharedConfigurations");
            this.getSharedConfigurations.setAccessible(true);
            this.getLocalConfigurations = managerClass.getDeclaredMethod("getLocalConfigurations");
            this.getLocalConfigurations.setAccessible(true);
            this.setStartupConfigurations = managerClass.getDeclaredMethod("setStartupConfigurations", Collection.class, Collection.class);
            this.setStartupConfigurations.setAccessible(true);
        }

        private boolean isTaskInstalled(@NotNull StartupTaskSpec task) throws ReflectiveOperationException {
            for (RunnerAndConfigurationSettings settings : allStartupConfigurations()) {
                if (matchesTask(settings, task)) {
                    return true;
                }
            }

            return false;
        }

        private @NotNull RunnerAndConfigurationSettings ensureStartupTaskConfiguration(@NotNull StartupTaskSpec task) throws ReflectiveOperationException {
            RunnerAndConfigurationSettings existing = findExistingTaskConfiguration(task);
            if (existing != null) {
                configureShellScript(existing.getConfiguration(), task);
                return existing;
            }

            ConfigurationFactory factory = findShellScriptFactory();
            if (factory == null) {
                throw new IllegalStateException("Shell Script configuration type is unavailable");
            }

            RunManagerImpl runManager = RunManagerImpl.getInstanceImpl(project);
            RunnerAndConfigurationSettings settings = runManager.createConfiguration(task.name, factory);
            configureShellScript(settings.getConfiguration(), task);
            runManager.addConfiguration(settings);

            RunnerAndConfigurationSettings persisted = runManager.getConfigurationById(settings.getUniqueID());
            return persisted != null ? persisted : settings;
        }

        private void addStartupTask(@NotNull RunnerAndConfigurationSettings settings) throws ReflectiveOperationException {
            List<RunnerAndConfigurationSettings> shared = new ArrayList<>(sharedConfigurations());
            List<RunnerAndConfigurationSettings> local = new ArrayList<>(localConfigurations());

            if (!containsSettings(shared, settings) && !containsSettings(local, settings)) {
                local.add(settings);
            }

            setStartupConfigurations.invoke(startupManager, shared, local);
        }

        private @Nullable RunnerAndConfigurationSettings findExistingTaskConfiguration(@NotNull StartupTaskSpec task) throws ReflectiveOperationException {
            RunManagerImpl runManager = RunManagerImpl.getInstanceImpl(project);
            for (RunnerAndConfigurationSettings settings : runManager.getAllSettings()) {
                if (matchesTask(settings, task)) {
                    return settings;
                }
            }

            return null;
        }

        private @NotNull Collection<RunnerAndConfigurationSettings> allStartupConfigurations() throws ReflectiveOperationException {
            List<RunnerAndConfigurationSettings> result = new ArrayList<>(sharedConfigurations());
            result.addAll(localConfigurations());
            return result;
        }

        @SuppressWarnings("unchecked")
        private @NotNull Collection<RunnerAndConfigurationSettings> sharedConfigurations() throws ReflectiveOperationException {
            return (Collection<RunnerAndConfigurationSettings>) getSharedConfigurations.invoke(startupManager);
        }

        @SuppressWarnings("unchecked")
        private @NotNull Collection<RunnerAndConfigurationSettings> localConfigurations() throws ReflectiveOperationException {
            return (Collection<RunnerAndConfigurationSettings>) getLocalConfigurations.invoke(startupManager);
        }

        private boolean containsSettings(@NotNull Collection<RunnerAndConfigurationSettings> settings, @NotNull RunnerAndConfigurationSettings target) {
            for (RunnerAndConfigurationSettings setting : settings) {
                if (setting == target || setting.getName().equals(target.getName())) {
                    return true;
                }
            }

            return false;
        }

        private boolean matchesTask(@NotNull RunnerAndConfigurationSettings settings, @NotNull StartupTaskSpec task) throws ReflectiveOperationException {
            if (task.name.equals(settings.getName())) {
                return true;
            }

            String commandPath = taskPath(task).toString();
            String normalizedCommandPath = normalizePathString(commandPath);
            for (String candidate : configurationPathCandidates(settings.getConfiguration())) {
                if (normalizePathString(candidate).equals(normalizedCommandPath)) {
                    return true;
                }
            }

            return false;
        }

        private @NotNull Path taskPath(@NotNull StartupTaskSpec task) {
            return projectRoot.resolve(task.relativeCommandPath).normalize();
        }

        private @NotNull List<String> configurationPathCandidates(@NotNull Object configuration) throws ReflectiveOperationException {
            List<String> candidates = new ArrayList<>();
            for (String methodName : List.of("getScriptPath", "getPath", "getFilePath", "getCommandLine", "getScriptText", "getScript")) {
                try {
                    Method method = configuration.getClass().getMethod(methodName);
                    method.setAccessible(true);
                    Object value = method.invoke(configuration);
                    if (value instanceof String stringValue && !stringValue.isBlank()) {
                        candidates.add(stringValue);
                    }
                } catch (NoSuchMethodException ignored) {
                }
            }

            return candidates;
        }

        private void configureShellScript(@NotNull Object configuration, @NotNull StartupTaskSpec task) throws ReflectiveOperationException {
            if (!invokeSetter(configuration, bashExecutable(), "setShellPath", "setInterpreterPath", "setShellPathText")) {
                throw new IllegalStateException("Shell Script configuration does not expose a shell path setter");
            }

            String commandPath = taskPath(task).toString();
            if (!invokeSetter(configuration, commandPath, "setScriptPath", "setPath", "setScript", "setCommandLine", "setCommand", "setScriptText")) {
                throw new IllegalStateException("Shell Script configuration does not expose a script path setter");
            }

            invokeSetter(configuration, projectRoot.toString(), "setWorkingDirectory", "setWorkDirectory", "setWorkDir", "setWorkingDir");
        }

        private @NotNull String bashExecutable() {
            for (String candidate : List.of("/bin/bash", "/usr/bin/bash", "bash")) {
                if ("bash".equals(candidate) || Files.isExecutable(Path.of(candidate))) {
                    return candidate;
                }
            }

            return "bash";
        }

        private @Nullable ConfigurationFactory findShellScriptFactory() {
            for (ConfigurationType type : ConfigurationType.CONFIGURATION_TYPE_EP.getExtensionList()) {
                String displayName = type.getDisplayName();
                String id = type.getId();
                boolean displayNameMatches = displayName != null && displayName.equalsIgnoreCase(SHELL_SCRIPT_TYPE_NAME);
                boolean idMatches = id != null && id.toLowerCase(Locale.ROOT).contains("shell");
                if (displayNameMatches || idMatches) {
                    ConfigurationFactory[] factories = type.getConfigurationFactories();
                    if (factories.length > 0) {
                        return factories[0];
                    }
                }
            }

            return null;
        }

        private boolean invokeSetter(@NotNull Object target, @NotNull String value, @NotNull String... methodNames) throws ReflectiveOperationException {
            for (String methodName : methodNames) {
                try {
                    Method method = target.getClass().getMethod(methodName, String.class);
                    method.setAccessible(true);
                    method.invoke(target, value);
                    return true;
                } catch (NoSuchMethodException ignored) {
                }
            }

            return false;
        }

        private static @NotNull String normalizePathString(@NotNull String value) {
            try {
                return Path.of(value).toAbsolutePath().normalize().toString();
            } catch (RuntimeException ignored) {
                return value.trim().toLowerCase(Locale.ROOT);
            }
        }
    }
}
