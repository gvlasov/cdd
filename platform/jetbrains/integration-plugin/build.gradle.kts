plugins {
    id("java")
    id("org.jetbrains.intellij.platform")
}

group = "com.github.chriego.cdd"
version = "0.1.0"

dependencies {
    intellijPlatform {
        intellijIdea("2025.1.7")
        testFramework(org.jetbrains.intellij.platform.gradle.TestFrameworkType.Platform)
    }
}

intellijPlatform {
    pluginConfiguration {
        id = "com.github.chriego.cdd.jetbrains.integration"
        name = "CDD Integration"

        ideaVersion {
            sinceBuild = "251"
        }

        vendor {
            name = "CDD"
        }

        description = """
            Adds Concept-Driven Design support to JetBrains IDEs.
        """.trimIndent()

        changeNotes = """
            Adds a CDD project type to the new project wizard and keeps the CDD startup task pane.
        """.trimIndent()
    }
}

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "21"
        targetCompatibility = "21"
    }

    processResources {
        from(file("../../../concepts/project-directories/directories-list.json")) {
            into("concepts/project-directories")
        }
    }
}
