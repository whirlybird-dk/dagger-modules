/**
 * Copyright 2024 Hilmar Gústafsson
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */

import { Container, Directory, Platform, dag, func, object } from "@dagger.io/dagger";

@object()
class Dotnet {
  private readonly defaultVersion = "8.0";
  private readonly defaultPlatform = "linux/amd64" as Platform;

  @func()
  async build(source: Directory): Promise<Container> {
    return await this.restoredProject(source)
      .withExec(["dotnet", "build", "--no-restore"])
      .sync();
  }

  @func()
  async test(source: Directory): Promise<Container> {
    return await this.restoredProject(source)
      .withExec(["dotnet", "test", "--no-restore"])
      .sync();
  }

  private restoredProject(source: Directory) {
    return this.dotnetSdk()
      .withWorkdir("/src")
      .withMountedDirectory("/src", source)
      .withExec(["dotnet", "restore"]);
  }

  private dotnetSdk() {
    return dag.container({ platform: "linux/amd64" as Platform })
      .from("mcr.microsoft.com/dotnet/sdk:8.0");
  }
}
