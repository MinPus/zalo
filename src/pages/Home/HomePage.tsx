import React from "react";
import { HomeHeader, Utinities, ListOA, NewsSection } from "@components";
import PageLayout from "@components/layout/PageLayout";
import { APP_UTINITIES } from "@constants/utinities";
import { useStore } from "@store";
import Contacts from "./Contacts";
import Procedures from "./Procedures";

const HomePage: React.FunctionComponent = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [organization] = useStore(state => [
        state.organization,
        state.getOrganization,
    ]);

    return (
        <PageLayout
            id="home-page"
            customHeader={
                <HomeHeader
                    title="WORK FLOW"
                    name="Ứng dụng hỗ trợ quản lý tiến độ công việc"
                />
            }
        >
            <Utinities utinities={APP_UTINITIES} />
            {/* <ListOA /> */}
            <Contacts />
            {/* <Procedures /> */}
            {/* <NewsSection /> */}
        </PageLayout>
    );
};

export default HomePage;
