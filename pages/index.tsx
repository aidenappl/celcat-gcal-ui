import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Joi from "joi";
import axios from "axios";
import { Oval } from "react-loader-spinner";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: ["edu"] } })
    .required(),
});

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonValue, setButtonValue] = useState("Copy Link");

  const CheckLinkValidity = async () => {
    const response = schema.validate({ email });
    if (response.error) {
      toast.error(response.error.message);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("https://aplb.xyz/celcat/getCalendar", {
        params: {
          name: email,
        },
        validateStatus: function () {
          return true;
        },
      });
      setLoading(false);
      if (response.status === 200) {
        setLink("https://aplb.xyz/celcat/getCalendar?name=" + email);
        toast.success("Success");
      } else {
        toast.error("Failed to find a valid calendar");
      }
    } catch (error) {}
  };

  return (
    <div className="w-full h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <Head>
        <title>Celcat ICS</title>
        <meta
          name="description"
          content="Converting celcat to your calendars"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {link ? (
        <div className="flex items-center justify-center w-full h-screen">
          <div className="w-full sm:w-[500px] h-fit bg-white sm:rounded-md p-7 sm:p-10 z-10 flex flex-col">
            <h1 className="text-lg font-semibold">Here is your link</h1>
            <a className={"text-blue-500 cursor-pointer break-all"} href={link}>
              {link}
            </a>
            <button
              className="w-fit h-fit px-5 py-1 bg-blue-600 text-white rounded-md mt-3"
              onClick={() => {
                setButtonValue("Copied!");
                navigator.clipboard.writeText(link);
              }}
            >
              {buttonValue}
            </button>
            <p className="pt-10">
              Copy and paste this into your respective calendar or download the
              ICS file by going to the url.
            </p>
          </div>
          <div className="w-full h-screen fixed top-0 left-0 bg-black opacity-40" />
        </div>
      ) : null}

      <main className="flex items-center justify-center w-full h-[80%] px-5">
        <div className="flex flex-col w-full sm:w-fit h-fit">
          <h1 className="w-full text-center text-4xl pb-14 font-medium">Celcat 2 ICS</h1>
          <div className="flex flex-col sm:flex-row">
            <input
              className="w-full sm:w-[400px] h-[50px] border-2 pl-4 rounded-md"
              type={"text"}
              placeholder={"Enter your Northeastern Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  CheckLinkValidity();
                }
              }}
            />
            <button
              className="w-full mt-5 sm:mt-0 sm:w-[175px] h-[50px] bg-blue-600 text-white sm:ml-5 rounded-md flex items-center justify-center"
              onClick={() => {
                CheckLinkValidity();
              }}
            >
              {loading ? (
                <Oval
                  width={22}
                  height={22}
                  strokeWidth={6}
                  color={"#ffffff"}
                  secondaryColor={"#fefefe"}
                />
              ) : (
                <span>Generate Calendar</span>
              )}
            </button>
          </div>
        </div>
      </main>
      <footer className="absolute bottom-0 w-full h-[70px] flex items-center justify-center text-slate-300">
        <span className="font-light">
          Built by{" "}
          <a
            href="https://aidenappleby.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold"
          >
            @AidenAppleby
          </a>
        </span>
      </footer>
    </div>
  );
};

export default Home;
