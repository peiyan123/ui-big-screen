import { createI18n } from "vue-i18n";
// 语言包
import zh from "./lang/zh";
import en from "./lang/en";

const i18n = createI18n({
    legacy: false,
    locale: sessionStorage.getItem("lang") || "zh",
    messages: {
        zh,
        en,
    },
});

export default i18n;
