import * as Icon from "@components/icons";
import { Utinity } from "@dts";
// import SocialInsuranceLogo from "@assets/logo-social-insurance.png";
// import Youtube from "@assets/youtube.png";
// import Location from "@assets/location.png";
// import Identification from "@assets/id-card.png";
// import InternalPhone from "@assets/internal-phone.png";
// import SocialInsurranceNumber from "@assets/social-insurance-number.png";
import Benefit from "@assets/benefits.png";
import Renew from "@assets/files.png";

export const APP_UTINITIES: Array<Utinity> = [
    {
        key: "create-schedule-appointment",
        label: "Calendar",
        icon: Icon.CalendarIcon,
        path: "/create-schedule-appointment",
    },
    {
        key: "info",
        label: "Project",
        icon: Icon.BookIcon,
        path: "/projects",
    },
    {
        key: "feedback",
        label: "Task",
        icon: Icon.PenIcon,
        path: "/feedbacks",
    },
    {
        key: "file-search",
        label: "Search",
        icon: Icon.SearchIcon,
        path: "/search",
    },
    {
        key: "Notification",
        label: "Notification",
        icon: Icon.NotificationIcon,
        path: "/information-guide",
    },
];

export const CONTACTS: Array<Utinity> = [
    {
        key: "",
        label: "Thông báo 1",
        link: "",
        // iconSrc: Icon.NotificationIcon,
    },
    {
        key: "",
        label: "Thông báo 2",
        link: "",
        // iconSrc: SocialInsurranceNumber,
    },
    {
        key: "",
        label: "Thông báo 3",
        link: "",
        // iconSrc: InternalPhone,
    }
];

export const PROCEDURES: Array<Utinity> = [
    {
        key: "renew",
        label: "Gia hạn thẻ BHYT trực tuyến",
        link: "",
        iconSrc: Renew,
    },
    {
        key: "benefit",
        label: "Các chế độ BHXH",
        link: "",
        iconSrc: Benefit,
    },
];
