import { useState, useEffect, useRef } from "react";
import logo from "../assets/safeLane_logo.svg";
import loaderSVG from "../assets/loader.svg";
import { set, useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useStore } from "../context/Store";





const Login = () => {
  const [submitError, setSubmitError] = useState('');
  const [inputValues, setInputValues] = useState([]);
  const navigate = useNavigate();
  const [reCaptchaError, setReCaptchaError] = useState();
  const { url } = useStore();
  const [otp, setOtp] = useState(false);
  const [userId, setUserId] = useState();

  const [timeLeft, setTimeLeft] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const recaptchaRef = useRef();
  const [loader, setLoader] = useState(false);


  // Helper to format seconds as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };


  //reCaptcha

  const onChange = () => {

    if (grecaptcha.getResponse() !== '') {
      setReCaptchaError();
    }

  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
    setFocus,
  } = useForm();

  const values = getValues();

  // Function to save token in a cookie with an expiration time
  const saveTokenToCookie = (value, expirationTimeInMinutes, type) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (expirationTimeInMinutes * 60 * 1000)); // Convert minutes to milliseconds
    if (type === 'token') {
      Cookies.set('authToken', value, { expires: expirationDate });
    }
    if (type === 'user') {
      var userObject = { name: value, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D' };
      var userJSON = JSON.stringify(userObject);
      Cookies.set('safelane-user', userJSON, { expires: expirationDate });
    }
  };

  const handleLogin = () => {
    setLoader(true);

    const dashboardLogin = () => {
      fetch(`${url}/wp-json/safelane-api/check-user-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        credentials: 'include',
        body: JSON.stringify(data) // Convert the data object to JSON string

      }).then(response => {


        if (!response) {
          throw new Error('Network response was not ok');
        } else {
          return response.json();
        }

      }).then(data => {
        setLoader(false);


        if (data) {


          if (data.status === "success") {
            setOtp(true);
            setUserId(data.user_id);
            setSubmitError();
            setWaitForResponse(false);
            setAttempts(0);

          } else if (attempts >= 3) {
            timer();
            setSubmitError(`עברת את מכסת השליחות. נסה שוב בעוד ${formatTime(timeLeft)}`);
            clearTimeout(timeoutId);

          } else {
            setSubmitError('אחד או יותר מהפרטים לא נכונים');
            setWaitForResponse(false);
            recaptchaRef.current.reset();

          }




        } else {
          setSubmitError('אחד או יותר מהפרטים לא נכונים')
        }



        saveTokenToCookie(data.user_display_name, 30, 'user');

      }).catch(error => {
        setLoader(false);
        setSubmitError('אחד או יותר מהפרטים לא נכונים')
      });
    }

    const username = values.userName;
    const password = values.password;

    const data = {
      username: username,
      password: password,
      recaptcha_token: null
    };

    if (grecaptcha.getResponse() !== '') {

      data.recaptcha_token = grecaptcha.getResponse();
      setWaitForResponse(true);
      dashboardLogin();


    } else {
      setReCaptchaError('אנא מלא')
    }


  };

  const handleOTP = () => {
    setWaitForResponse(true);
    setLoader(true);


    fetch(`${url}/wp-json/safelane-api/check-user-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',

      body: JSON.stringify({
        "user_id": userId,
        "otp": values.otp
      })
    }).then(response => {


      if (!response) {
        throw new Error('Network response was not ok');
      } else {
        return response.json();
      }

    }).then(data => {
      setLoader(false);


      if (data) {

        if (data.status === "success") {

          navigate(`/dashboard`);

        } else if (attempts >= 3) {
          timer();
          setSubmitError(`עברת את מכסת השליחות. נסה שוב בעוד ${formatTime(timeLeft)}`);
          clearTimeout(timeoutId);

        } else {
          setSubmitError('אחד או יותר מהפרטים לא נכונים');
          setWaitForResponse(false);

        }
      } else {
        setSubmitError('אחד או יותר מהפרטים לא נכונים')
      }






    }).catch(error => {
      setSubmitError('אחד או יותר מהפרטים לא נכונים');
      setLoader(false);

    });


  }

  const handleBlur = (e) => {

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      document.querySelector('.main-container').classList.remove('focus')
    }

  }

  const handleFocus = (e) => {

    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
      document.querySelector('.main-container').classList.add('focus')
    }


  }

  const handleClearInput = (fieldName) => {
    setFocus(fieldName)
    reset({
      [fieldName]: ''
    })

  }

  useEffect(() => {

    if (
      inputValues[0] !== values.userName && submitError !== '' && !errors.userName
      ||
      inputValues[1] !== values.password && submitError !== '' && !errors.password
    ) {
      setSubmitError('');
    }





  }, [watch('userName'), watch('password')]);


  const startTimeout = () => {
    const id = setTimeout(() => {

      setAttempts(0);
      startTimeout();

    }, 5000);

    setTimeoutId(id);
  };


  function timer() {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    if (timeLeft > 0) {
      setSubmitError(`עברת את מכסת השליחות. נסה שוב בעוד ${formatTime(timeLeft)}`);
    } else {
      setSubmitError();
      setWaitForResponse(false);
      if (!otp) {
        recaptchaRef.current.reset();
      }
      setAttempts(0);
    }
  }, [timeLeft]);







  return (
    <div className="login">
      {/* <button onClick={() => test()}>test login</button> */}
      <div className="login__wrapper">
        <img className="login__logo" src={logo} loading="lazy" />

        {loader ? <img className="loader" src={loaderSVG} /> : <div className="login__box">
          <h1 className="head_24"><strong>{otp ? 'אימות דו-שלבי ' : 'התחברות'}</strong></h1>
          {otp && <p className="parag_16 login__otp-message">יש להזין את קוד האימות מאפליקציית Google Authenticator</p>}
          {!otp ? <div className="form">
            <form className="login__form" onSubmit={handleSubmit(handleLogin)}>
              <div className={errors.userName || submitError ? "form__input__wrapper with-errors" : "form__input__wrapper"}>
                <input
                  onFocus={handleFocus}
                  className="form__input parag_16"
                  type="text"
                  placeholder=" "
                  name="userName"
                  {...register("userName", {
                    required: "נא להזין שם משתמש",
                  })}
                  onBlur={handleBlur}

                />
                <label className="placeholder-text parag_16">שם משתמש</label>
                <button type="button" className={watch('userName') ? "clearInput show" : "clearInput"} onClick={() => handleClearInput("userName")}></button>
                {errors.userName && (<p className="form__input__errors caption_15">{errors.userName.message}</p>)}
              </div>
              <div className={errors.password || submitError ? "form__input__wrapper with-errors" : "form__input__wrapper"}>
                <input
                  onFocus={handleFocus}
                  className="form__input parag_16"
                  type="password"
                  placeholder=" "
                  name="password"
                  {...register("password", {
                    required: "נא להזין סיסמא",
                  })}
                  onBlur={handleBlur}

                />
                <label className="placeholder-text parag_16">סיסמא</label>
                <button type="button" className={watch('password') ? "clearInput show" : "clearInput"} onClick={() => handleClearInput("password")}></button>
                {errors.password && (<p className="form__input__errors caption_15">{errors.password.message}</p>)}
              </div>
              <div className="reCaptcha">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LcFZgUqAAAAAGL_-Ij_y4TzF318JM48m-E6ab4u"
                  onChange={onChange} />
                {reCaptchaError && <p className="form__input__errors caption_15">{reCaptchaError}</p>}
              </div>


              <div className="form__button__wrapper">
                {submitError && (<p className="form__input__errors caption_15">{submitError}</p>)}
                <button
                  className="basic-button blue-button"
                  disabled={waitForResponse || errors.userName || errors.password || reCaptchaError}

                  onClick={() => {
                    if (!errors.userName && !errors.password && !reCaptchaError) {
                      handleSubmit();
                      if (timeoutId !== null) {
                        startTimeout()

                      }
                      setAttempts((prev) => prev + 1);
                    }
                  }}
                >כניסה</button>
              </div>
            </form>

          </div>
            :
            <form className="login__form" onSubmit={handleSubmit(handleOTP)}>
              <div className={errors.otp || submitError ? "form__input__wrapper with-errors" : "form__input__wrapper"}>
                <input
                  onFocus={handleFocus}
                  className="form__input parag_16"
                  type="text"
                  placeholder=" "
                  name="otp"
                  minLength={6}
                  maxLength={6}
                  {...register("otp", {
                    required: "נא להזין קוד אימות",
                  })}
                  onBlur={handleBlur}

                />
                <label className="placeholder-text parag_16">קוד אימות</label>
                <button type="button" className={watch('otp') ? "clearInput show" : "clearInput"} onClick={() => { handleClearInput("otp"); setSubmitError('') }}></button>
                {errors.otp && (<p className="form__input__errors caption_15">{errors.otp.message}</p>)}
              </div>




              <div className="form__button__wrapper">
                {submitError && (<p className="form__input__errors caption_15">{submitError}</p>)}
                <button
                  className="basic-button blue-button"
                  disabled={errors.otp || waitForResponse}
                  onClick={() => {
                    if (!errors.otp) {
                      handleSubmit();
                      if (timeoutId !== null) {
                        startTimeout()
                      }
                      setAttempts((prev) => prev + 1);

                    }
                  }}

                >כניסה</button>
              </div>
            </form>
          }

        </div>}




      </div >
    </div >

  )

}

export default Login


