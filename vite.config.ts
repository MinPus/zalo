import { defineConfig } from "vite";
    import react from "@vitejs/plugin-react";
    import macrosPlugin from "vite-plugin-babel-macros";
    import zmp from "zmp-vite-plugin"; // Đảm bảo plugin này đã được cài đặt
    import path from "path";

    // https://vitejs.dev/config/
    export default () => {
        return defineConfig({
            root: ".", // Đặt root về thư mục gốc của dự án
            base: "/", // Đặt base phù hợp với Zalo Mini App
            plugins: [react(), macrosPlugin(), zmp()], // Thêm zmp()
            build: {
                target: "es2020",
                outDir: "www", // Đặt thư mục đầu ra là 'www'
                assetsDir: "assets", // Thư mục cho tài nguyên tĩnh
            },
            resolve: {
                alias: {
                    "@assets": path.resolve(__dirname, "src/assets"),
                    "@components": path.resolve(__dirname, "src/components"),
                    "@common": path.resolve(__dirname, "src/common"),
                    "@constants": path.resolve(__dirname, "src/constants"),
                    "@routes": path.resolve(__dirname, "src/routes"),
                    "@shared": path.resolve(__dirname, "src/shared"),
                    "@utils": path.resolve(__dirname, "src/utils"),
                    "@pages": path.resolve(__dirname, "src/pages"),
                    "@dts": path.resolve(__dirname, "src/types"),
                    "@state": path.resolve(__dirname, "src/state"),
                    "@service": path.resolve(__dirname, "src/service"),
                    "@store": path.resolve(__dirname, "src/store"),
                    "@mock": path.resolve(__dirname, "src/mock"),
                },
            },
        });
    };