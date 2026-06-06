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
            Initial version: adds a CDD scope to the Project tool window.
        """.trimIndent()
    }
}

tasks {
    withType<JavaCompile> {
        sourceCompatibility = "21"
        targetCompatibility = "21"
    }
}
