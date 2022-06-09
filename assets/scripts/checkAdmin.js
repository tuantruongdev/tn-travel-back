const checkAdmin = async () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!(await red())) {
    window.location.href = "https://tn-travelxd.herokuapp.com/Front-End/login.html";
  }
  if (userData.role !== "admin") {
    alert("Sorry, You Are Not Allowed to Access This Page");
    window.location.href = "https://tn-travelxd.herokuapp.com/Front-End/index.html";
    return;
  }
  console.log("check admin succesful");
};

(() => {
  checkAdmin();
})();
