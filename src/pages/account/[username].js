import User from '../../_pages/User/User';

const Account = () => {
  return <User />;
};

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

export default Account;
