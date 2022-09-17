// fetch("https://jsonplaceholder.typicode.com/users")
//   .then((res) => res.json())
//   .then((data) => console.log(data));

// fetch("https://randomuser")
//   .then((res) => res.json())
//   .then((data) => console.log(data.results[0].name.title))
//   .catch((err) => console.log(err.message));

// const loadData = async () => {
//   const res = await fetch("https://jsonplaceholder.typicode.com/users");
//   const data = await res.json();
//   console.log(data);
// };

// loadData();

const loadData = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const showData = async () => {
  const res = await loadData("https://randomuser.me/api/");
  console.log(res);
};

showData();

// const showData = (url) => fetch(url).then((res) => res.json());

// showData("https://randomuser.me/api/").then((data) => console.log(data));
