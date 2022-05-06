import CreateNewFile from "../components/CreateNewFileForm";
import Link from "next/link";
import { Container } from "semantic-ui-react";

const newFilePage = () => {
  return (
    <Container style={{ margin: "20px 0px" }}>
      <Link href="/">Back to Home Page</Link>
      <CreateNewFile />
    </Container>
  );
};

export default newFilePage;
