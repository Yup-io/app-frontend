import { Tab, Tabs } from '@mui/material'

const YupTabs = ({ tabs, value, onChange }) => (
  <Tabs
    onChange={(event, newValue) => onChange(newValue, event)}
    value={value}
  >
    {tabs.map(({ label, value }) => (
      <Tab
        key={value}
        label={label}
        value={value}
      />
    ))}
  </Tabs>
);

export default YupTabs;
