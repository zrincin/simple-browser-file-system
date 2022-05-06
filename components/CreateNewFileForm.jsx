import { useRef } from "react";
import { useRouter } from "next/router";
import { Container, Form, Button } from "semantic-ui-react";

const CreateNewFile = () => {
  const filenameRef = useRef();
  const filetypeRef = useRef();

  const router = useRouter();

  const submiFormtHandler = (e) => {
    e.preventDefault();

    const enteredFilename = filenameRef.current.value;
    const enteredFiletype = filetypeRef.current.value;

    const reqBody = {
      filename: enteredFilename,
      filetype: enteredFiletype,
    };

    fetch("/api/files", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
    router.replace("/");
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <h3>Create new file</h3>
      <Form onSubmit={submiFormtHandler}>
        <Form.Field>
          <label htmlFor="file-name">Input desired file name:</label>
          <input required type="text" id="file-name" ref={filenameRef} />
        </Form.Field>
        <Form.Field>
          <label htmlFor="file-type">
            Input desired file type (extension):
          </label>
          <input
            required
            type="text"
            id="file-type"
            placeholder="e.g. txt, pdf, jpg, gif, etc."
            ref={filetypeRef}
          />
        </Form.Field>
        <Button primary>Create</Button>
      </Form>
    </Container>
  );
};

export default CreateNewFile;
