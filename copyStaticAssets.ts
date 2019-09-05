import * as shell from "shelljs";

shell.rm("-rf", "dist/files");
shell.cp("-R", "src/files", "dist/files");
