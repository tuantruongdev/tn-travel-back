const getLocation = async (locationId) => {
  const fetchlocation = await ftechAPI(
    "https://tn-travelxd.herokuapp.com/api/v1/locations/" + locationId,
    "GET",
    JSON.stringify({})
  );
  if (fetchlocation.status !== "success") {
    console.log("get location failed");
    return;
  }
  return fetchlocation;
};

const locationFetch = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get("id");
  if (!code) {
    window.location.href =
      "https://tn-travelxd.herokuapp.com/view-tour/QLtour.html";
    return;
  }
  const tour = await getLocation(code);
  document.getElementById("maTour").value = tour.data.location._id;
  document.getElementById("tenDiaDanh").value = tour.data.location.name;
  document.getElementById("overView").value = tour.data.location.overView;

  document.getElementById("moTa").value = tour.data.location.description;
  tinymce.init({
    selector: "#moTa",
  });
  document.getElementById("imageCover").value = tour.data.location.imageCover;
  let listImage = ``;
  tour.data.location.images.forEach((img) => {
    listImage += img + "\n";
  });

  document.getElementById("listImage").value = listImage;

  //console.log(new Date(tour.data.location.startDate).toISOString().split(",")[0]);
};
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
const editLocation = async () => {
  document.getElementById("success").setAttribute("hidden", "");
  document.getElementById("alert").setAttribute("hidden", "");

  const _id = document.getElementById("maTour").value;
  const name = document.getElementById("tenDiaDanh").value;
  const overView = document.getElementById("overView").value;
  const description = tinymce.get("moTa").getContent();

  const imageCover = document.getElementById("imageCover").value;
  if (!validURL(imageCover)) {
    document.getElementById("success").setAttribute("hidden", "");
    document.getElementById("alert").removeAttribute("hidden");
    document.getElementById("alert").innerHTML = "URL kh??ng ????ng";
    return;
  }

  const listImage = document.getElementById("listImage").value.split("\n");
  if (
    listImage[listImage.length - 1] === "" ||
    listImage[listImage.length - 1] === " "
  ) {
    listImage.pop();
  }

  listImage.forEach((img) => {
    if (!validURL(img)) {
      document.getElementById("success").setAttribute("hidden", "");
      document.getElementById("alert").removeAttribute("hidden");
      document.getElementById("alert").innerHTML = "List URL kh??ng ????ng";
      return;
    }
  });

  //console.log(listImage);

  const _updateLocation = await updateLocation(
    {
      name,
      overView,
      description,
      imageCover,
      images: listImage,
    },
    _id
  );
  if (_updateLocation.status !== "success") {
    document.getElementById("success").setAttribute("hidden", "");
    document.getElementById("alert").removeAttribute("hidden");
    document.getElementById("alert").innerHTML =
      "C?? l???i s???y ra!!  " + _updateLocation.message;
    return;
  }
  document.getElementById("alert").setAttribute("hidden", "");
  document.getElementById("success").removeAttribute("hidden");
  document.getElementById("success").innerHTML =
    "S???a ?????a ??i???m th??nh c??ng! V??? danh s??ch ?????a ??i???m sau 3 gi??y...";
  await new Promise((r) => setTimeout(r, 3000));
  window.location.href =
    "https://tn-travelxd.herokuapp.com/view-dia-danh/QLdiadanh.html";
  //console.log(_updateTour);
};
const updateLocation = async (obj, id) => {
  const updateLocation = await ftechAPI(
    "https://tn-travelxd.herokuapp.com/api/v1/locations/" + id,
    "PATCH",
    JSON.stringify(obj)
  );

  return updateLocation;
};
(() => {
  locationFetch();

  document.getElementById("btnSua").onclick = editLocation;
})();
