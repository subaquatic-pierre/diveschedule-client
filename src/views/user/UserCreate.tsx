import { Icon } from "@iconify/react";
import { capitalCase } from "change-case";
import { useState, useEffect } from "react";
import roundVpnKey from "@iconify/icons-ic/round-vpn-key";
import roundAccountBox from "@iconify/icons-ic/round-account-box";
// material
import { Container, Tab, Box, Tabs } from "@material-ui/core";
// redux
import {
  getCards,
  getProfile,
  getInvoices,
  getAddressBook,
  getNotifications,
  initialState,
} from "../../controllers/user";
// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// components
import Page from "../../components/Page";
import HeaderDashboard from "../../components/HeaderDashboard";
import {
  AccountGeneral,
  AccountChangePassword,
} from "../../components/user/account";

// ----------------------------------------------------------------------

export default function UserAccount() {
  const [currentTab, setCurrentTab] = useState("general");
  const { cards, myProfile, notifications } = initialState;

  if (!myProfile) {
    return null;
  }

  if (!cards) {
    return null;
  }

  if (!notifications) {
    return null;
  }

  const ACCOUNT_TABS = [
    {
      value: "general",
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: "change_password",
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <AccountChangePassword />,
    },
  ];

  return (
    <Page title="User: Account Settings | DiveSchedule">
      <Container>
        <HeaderDashboard
          heading="Account"
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            { name: "Users", href: PATH_DASHBOARD.user.list },
            { name: "Create Account" },
          ]}
        />

        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={(e, value) => setCurrentTab(value)}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}