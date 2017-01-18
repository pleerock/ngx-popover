import {Gulpclass, Task, SequenceTask, MergedTask} from "gulpclass";

const gulp = require("gulp");
const del = require("del");
const shell = require("gulp-shell");
const replace = require("gulp-replace");
const mocha = require("gulp-mocha");
const chai = require("chai");
const tslint = require("gulp-tslint");
const stylish = require("tslint-stylish");
const ts = require("gulp-typescript");
const rename = require("gulp-rename");
const file = require("gulp-file");
const uglify = require("gulp-uglify");

const packageName = require("./package.json").name;

@Gulpclass()
export class Gulpfile {

    // -------------------------------------------------------------------------
    // General tasks
    // -------------------------------------------------------------------------

    /**
     * Cleans build folder.
     */
    @Task()
    clean(cb: Function) {
        return del(["./build/**"], cb);
    }

    /**
     * Runs typescript files compilation.
     */
    @Task()
    compile() {
        return gulp.src("package.json", { read: false })
            .pipe(shell([
                "\"node_modules/.bin/ngc\" -p tsconfig-aot.json"
            ]));
    }

    // -------------------------------------------------------------------------
    // Packaging and Publishing tasks
    // -------------------------------------------------------------------------

    /**
     * Compiles and compiles bundles.
     */
    @MergedTask()
    compileBundles() {
        const amdTsProject = ts.createProject("tsconfig.json", {
            module: "amd",
            outFile: packageName + ".amd.js",
            typescript: require("typescript")
        });
        const systemTsProject = ts.createProject("tsconfig.json", {
            module: "system",
            outFile: packageName + ".system.js",
            typescript: require("typescript")
        });
        const amdPureTsProject = ts.createProject("tsconfig.json", {
            module: "amd",
            outFile: packageName + ".pure.amd.js",
            noEmitHelpers: true,
            noImplicitUseStrict: true,
            typescript: require("typescript")
        });
        const systemPureTsProject = ts.createProject("tsconfig.json", {
            module: "system",
            outFile: packageName + ".pure.system.js",
            noEmitHelpers: true,
            noImplicitUseStrict: true,
            typescript: require("typescript")
        });

        return [
            gulp.src("build/bundle/**/*.ts")
                .pipe(amdTsProject()).js
                .pipe(gulp.dest("build/package")),

            gulp.src("build/bundle/**/*.ts")
                .pipe(systemTsProject()).js
                .pipe(gulp.dest("build/package")),

            gulp.src("build/bundle/**/*.ts")
                .pipe(amdPureTsProject()).js
                .pipe(gulp.dest("build/package")),

            gulp.src("build/bundle/**/*.ts")
                .pipe(systemPureTsProject()).js
                .pipe(gulp.dest("build/package"))
        ];
    }

    /**
     * Copies all source files into destination folder in a correct structure to build bundles.
     */
    @Task()
    bundleCopySources() {
        return gulp.src(["./src/**/*.ts"])
            .pipe(gulp.dest("./build/bundle/" + packageName));
    }

    /**
     * Creates special main file for bundle build.
     */
    @Task()
    bundleCopyMainFile() {
        return gulp.src("./package.json", { read: false })
            .pipe(file(packageName + ".ts", `export * from "./${packageName}/index";`))
            .pipe(gulp.dest("./build/bundle"));
    }

    /**
     * Uglifys bundles.
     */
    @MergedTask()
    uglify() {
        return [
            gulp.src(`./build/package/${packageName}.pure.amd.js`)
                .pipe(uglify())
                .pipe(rename(`${packageName}.pure.amd.min.js`))
                .pipe(gulp.dest("./build/package")),

            gulp.src(`./build/package/${packageName}.pure.system.js`)
                .pipe(uglify())
                .pipe(rename(`${packageName}.pure.system.min.js`))
                .pipe(gulp.dest("./build/package")),

            gulp.src(`./build/package/${packageName}.amd.js`)
                .pipe(uglify())
                .pipe(rename(`${packageName}.amd.min.js`))
                .pipe(gulp.dest("./build/package")),

            gulp.src(`./build/package/${packageName}.system.js`)
                .pipe(uglify())
                .pipe(rename(`${packageName}.system.min.js`))
                .pipe(gulp.dest("./build/package")),
        ];
    }

    /**
     * Publishes a package to npm from ./build/package directory.
     */
    @Task()
    npmPublish() {
        return gulp.src("package.json", { read: false })
            .pipe(shell([
                "cd ./build/package && npm publish"
            ]));
    }

    /**
     * Change the "private" state of the packaged package.json file to public.
     */
    @Task()
    packagePreparePackageFile() {
        return gulp.src("./package.json")
            .pipe(replace("\"private\": true,", "\"private\": false,"))
            .pipe(gulp.dest("./build/package"));
    }

    /**
     * This task will replace all typescript code blocks in the README (since npm does not support typescript syntax
     * highlighting) and copy this README file into the package folder.
     */
    @Task()
    packageReadmeFile() {
        return gulp.src("./README.md")
            .pipe(replace(/```typescript([\s\S]*?)```/g, "```javascript$1```"))
            .pipe(gulp.dest("./build/package"));
    }

    /**
     * Creates a package that can be published to npm.
     */
    @SequenceTask()
    package() {
        return [
            "clean",
            ["bundleCopySources", "bundleCopyMainFile"],
            ["compile", "compileBundles"],
            ["uglify"],
            ["packagePreparePackageFile", "packageReadmeFile"]
        ];
    }

    /**
     * Creates a package and publishes it to npm.
     */
    @SequenceTask()
    publish() {
        return ["package", "npmPublish"];
    }

    // -------------------------------------------------------------------------
    // Run tests tasks
    // -------------------------------------------------------------------------

    /**
     * Runs ts linting to validate source code.
     */
    @Task()
    tslint() {
        return gulp.src(["./src/**/*.ts", "./test/**/*.ts", "./sample/**/*.ts"])
            .pipe(tslint())
            .pipe(tslint.report(stylish, {
                emitError: true,
                sort: true,
                bell: true
            }));
    }

    /**
     * Runs unit-tests.
     */
    @Task()
    unit() {
        chai.should();
        chai.use(require("sinon-chai"));
        return gulp.src("./build/es5/test/unit/**/*.js")
            .pipe(mocha());
    }

    /**
     * Compiles the code and runs tests.
     */
    @SequenceTask()
    tests() {
        return ["clean", "compile", "tslint", "unit"];
    }

}