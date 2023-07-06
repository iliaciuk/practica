import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

function App() {
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  const handleJustifyClick = (value: string) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/api/user-login", {
        email: loginEmail,
        password: loginPassword,
      });
      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token); 
        navigate("/product");
        console.log("Logged in successfully");
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        text: "An error occurred. Please try again later.",
        icon: "error",
      });
    }
  };
  
  
  

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreeTerms) {
      Swal.fire({
        text: "Please agree to the terms and conditions.",
        icon: "warning",
      });
      return;
    }
    try {
      const response = await axios.post("http://localhost/api/user-signup", {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      });
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          text: response.data.message,
        });
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        text: "An error occurred. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <MDBTabs
        pills
        justify
        className="mb-3 d-flex flex-row justify-content-between"
      >
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab1")}
            active={justifyActive === "tab1"}
          >
            Login
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleJustifyClick("tab2")}
            active={justifyActive === "tab2"}
          >
            Register
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={justifyActive === "tab1"}>
          <form onSubmit={handleLogin}>
            <MDBInput
              wrapperClass="mb-4"
              label="Email address"
              id="form1"
              type="email"
              value={loginEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLoginEmail(e.target.value)
              }
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form2"
              type="password"
              value={loginPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLoginPassword(e.target.value)
              }
            />
            <MDBBtn className="mb-4 w-100" type="submit"style={{ height: "40px" }}>
              Sign in
            </MDBBtn>
          </form>
        </MDBTabsPane>

        <MDBTabsPane show={justifyActive === "tab2"}>
          <form onSubmit={handleRegister}>
            <MDBInput
              wrapperClass="mb-4"
              label="Name"
              id="form1"
              type="text"
              value={registerName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRegisterName(e.target.value)
              }
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Email"
              id="form2"
              type="email"
              value={registerEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRegisterEmail(e.target.value)
              }
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Password"
              id="form3"
              type="password"
              value={registerPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setRegisterPassword(e.target.value)
              }
            />
            <div className="d-flex justify-content-center mb-4">
              <MDBCheckbox
                name="agreeTerms"
                id="flexCheckDefault"
                label="I have read and agree to the terms"
                checked={agreeTerms}
                onChange={() => setAgreeTerms(!agreeTerms)}
              />
            </div>
            <MDBBtn className="mb-4 w-100" type="submit"style={{ height: "40px" }}>
              Sign up
            </MDBBtn>
          </form>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
}

export default App;
