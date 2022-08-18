import { Container, Stack, Button, TextField } from "@mui/material";
import { FormEvent } from "react";

function onSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const target = e.target
  const formData = new FormData(target)
  console.log(formData)
}

export function Login() {
  return (
    <Container>
      <form onSubmit={onSubmit}>
        <Stack spacing={2}>
          <TextField name="loginId" label="id" />
          <TextField name="password" label="password" type="password" />
          <Button type="submit">Login</Button>
        </Stack>
      </form>
    </Container>
  )
}