package com.github.chriego.cdd.jetbrains.project;

public final class CddProjectSettings {
    private final String originRemoteUrl;

    public CddProjectSettings(String originRemoteUrl) {
        this.originRemoteUrl = originRemoteUrl == null ? "" : originRemoteUrl.trim();
    }

    public String originRemoteUrl() {
        return originRemoteUrl;
    }
}
