import { Tab, Tabs } from '@mui/material';
import { TabsContainer } from './styles';

const YupPageTabs = ({ tabs, value, onChange }) => (
  <TabsContainer>
    <Tabs onChange={(event, newValue) => onChange(newValue, event)} value={value}>
      {tabs.map(({ label, value }) => (
        <Tab key={value} label={label} value={value} />
      ))}
    </Tabs>
  </TabsContainer>
);

export default YupPageTabs;
