// Under Review

import React, { Component, ReactNode } from "react";
import Tab from "./Tab";

interface TabsProps {
  children: ReactNode;
}

interface TabsState {
  activeTab: string;
}

type TabElement = React.ReactElement<React.ComponentProps<typeof Tab>>;

class Tabs extends Component<TabsProps, TabsState> {
  constructor(props: TabsProps) {
    super(props);

    this.state = {
      activeTab: (props.children as TabElement[])[0].props["page-label"],
    };
  }

  onClickTabItem = (tab: string) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const {
      onClickTabItem,
      props: { children },
      state: { activeTab },
    } = this;

    return (
      <div className="tabs">
        <div className="tab-content">
          {React.Children.map(children, (child) => {
            if ((child as TabElement).props["page-label"] !== activeTab)
              return null;
            return child as TabElement;
          })}
        </div>

        <ol className="tab-list">
          {React.Children.map(children, (child) => {
            const label = (
              child as React.ReactElement<{ "page-label": string }>
            ).props["page-label"];
            // console.log('Label:', label);
            return (
              <Tab
                activeTab={activeTab}
                key={label}
                page-label={label}
                onClick={onClickTabItem}
              />
            );
          })}
        </ol>
      </div>
    );
  }
}

export default Tabs;
