import { useState, useEffect } from "react";
import logo from "../assets/safeLane_logo.svg";
// import illustration from "../assets/login_illustration.svg";
import { useForm } from "react-hook-form";
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

  //reCaptcha

  const onChange = () => {

    if (grecaptcha.getResponse() !== '') {
      setReCaptchaError()
    }

  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
    setFocus
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

    const dashboardLogin = () => {
      fetch(`${url}/wp-json/jwt-auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify the content type as JSON
        },
        body: JSON.stringify(data) // Convert the data object to JSON string
      }).then(response => {

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        return response.json();

      }).then(data => {

        saveTokenToCookie(data.token, 30, 'token');
        saveTokenToCookie(data.user_display_name, 30, 'user');
        navigate(`/dashboard`);

      }).catch(error => {
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

      // if (data.success) {
      data.recaptcha_token = grecaptcha.getResponse();
      dashboardLogin();

      // } else {
      //   setReCaptchaError('נא לנסות שוב')
      // }

      // (async () => {
      //   try {
      //     const response = await fetch(`${window.location.protocol}//${window.location.hostname}/reCaptcha.php?token=${grecaptcha.getResponse()}`, {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json'
      //       },
      //     })
      //     const data = await response.json();
      //     if (data.success) {
      //       dashboardLogin();

      //     } else {
      //       setReCaptchaError('נא לנסות שוב')
      //     }
      //   } catch (error) {
      //     console.error('Error fetching data:', error);
      //   }
      // })();

    } else {
      setReCaptchaError('אנא מלא')
    }





    // dashboardLogin();






  };




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





  }, [watch('userName'), watch('password')])



  return (
    <div className="login">
      <div className="login__wrapper">
        <img className="login__logo" src={logo} loading="lazy" />
        <div className="login__box">
          <h1 className="head_24"><strong>התחברות</strong></h1>
          <div className="form">
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
                  sitekey="6LcFZgUqAAAAAGL_-Ij_y4TzF318JM48m-E6ab4u"
                  onChange={onChange} />
                {reCaptchaError && <p className="form__input__errors caption_15">{reCaptchaError}</p>}
              </div>


              <div className="form__button__wrapper">
                {submitError && (<p className="form__input__errors caption_15">{submitError}</p>)}
                <button
                  className="basic-button blue-button"
                  disabled={errors.userName || errors.password || reCaptchaError}
                >כניסה</button>
              </div>
            </form>

          </div>


        </div>


      </div>
    </div>

  )

}

export default Login