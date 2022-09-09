import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Joi from "joi";
import axios from "axios";
import Link from "next/link";
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
    <div>
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
          <div className="w-[500px] h-fit bg-white rounded-md p-10 z-10">
            <h1 className="text-lg font-semibold">Here is your link</h1>
            <a className={"text-blue-500 cursor-pointer"} href={link}>
              {link}
            </a>
            <p className="pt-10">
              Copy and paste this into your respective calendar or download the
              ICS file by going to the url.
            </p>
            {/* <h2>Want to add it to your calendar?</h2>
            <div className="flex">
              <Link href={"https://calendar.google.com/calendar/u/0/r?cid=webcal%3A%2F%2Fical.befunky.in%2Fical%2Fbefunky.ics"}>
                <a>
                  <button className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4">
                    Google Calendar
                  </button>
                </a>
              </Link>
            </div> */}
          </div>
          <div className="w-full h-screen fixed top-0 left-0 bg-black opacity-40" />
        </div>
      ) : null}

      <main className="flex items-center justify-center w-full h-screen">
        <input
          className="w-[400px] h-[50px] border-2 pl-4 rounded-md"
          type={"text"}
          placeholder={"Enter your Northeastern Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="w-[175px] h-[50px] bg-blue-600 text-white ml-5 rounded-md flex items-center justify-center"
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
      </main>
    </div>
  );
};

export default Home;
