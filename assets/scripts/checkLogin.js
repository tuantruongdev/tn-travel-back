const checkloggedIn = async () => {
  var requestOptions = {
    method: "POST",
    redirect: "follow",
    credentials: "include",
  };
  //console.log("cac");
  return fetch(
    "https://tn-travelxd.herokuapp.com/api/v1/users/auth",
    requestOptions
  )
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => console.log("err", error));
};

const red = async () => {
  const loggedin = await checkloggedIn();
  console.log(loggedin);
  if (loggedin.status === "success") {
    // dang nhap thanh cong
    //   console.log("loggedin");

    return true;
  } else {
    // console.log("not logged in");
    //chua dang nhap
    return false;
  }
  // window.location.replace("http://127.0.0.1:5500/public/index.html");
};
//document.addEventListener("DOMContentLoaded", red, false);
//console.log("ttd");
