const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    // srcディレクトリ配下のbackground.tsをdist/js配下へ移送する
    mode: process.env.NODE_ENV || "development",
    entry: {
        background: path.join(__dirname, "src/background.ts"),
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    // publicディレクトリに配置する静的リソースやmanifest.json等を移送する
    plugins: [
        new CopyWebpackPlugin({ patterns: [{ from: "public", to: "../" }] })
    ],
};
