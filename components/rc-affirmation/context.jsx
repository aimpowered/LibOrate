import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const defaultAffirmations = [
  "Say what I want to say, whatever happens will help me grow",
  "I can take up space",
  "I have an important voice",
  "Feel the tension and proceed",
  "I have the right to stutter",
];

// TODO: implement resize functionality
// resize tag to determine which direction to resize
// none - no resize
// "all" - resize in all directions
// "left" - resize left
// "right" - resize right
// "top" - resize top
// "bottom" - resize bottom
// "horizontal" - resize horizontally, left and right
// "vertical" - resize vertically, top and bottom
// "left-top" - resize left-top corner
// "right-top" - resize right-top corner
// "left-bottom" - resize left-bottom corner
// "right-bottom" - resize right-bottom corner
// resize?: string;

const myContext = createContext();

export const useMyContext = () => useContext(myContext);

export const Provider = ({ resize, children }) => {
  const [data, setData] = useState(defaultAffirmations);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/users/userData/affirmation", {
        method: "GET",
      });
      if (response.ok) {
        const { affirmations } = await response.json();
        if (affirmations && affirmations.length > 0) {
          setData(affirmations);
        }
      } else {
        console.error("Failed to fetch affirmations");
      }
    } catch (error) {
      console.error("Error fetching affirmations:", error);
    }
  }, []);

  // check if resize is a valid value
  const validResizeValues = [
    "all",
    "left",
    "right",
    "top",
    "bottom",
    "horizontal",
    "vertical",
    "left-top",
    "right-top",
    "left-bottom",
    "right-bottom",
  ];
  const resizeValue = resize
    ? validResizeValues.includes(resize)
      ? resize
      : "all"
    : "";

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateData = async (newData) => {
    try {
      const response = await fetch("/api/auth/users/userData/affirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        return true;
      } else {
        console.error("Failed to update affirmations");
        return false;
      }
    } catch (error) {
      console.error("Error updating affirmations:", error);
      return false;
    }
  };

  const addAffirmation = (text) => {
    const newData = [...data];
    if (currentIndex > data.length - 1) {
      newData.push(text);
    } else {
      newData.splice(currentIndex, 0, text);
    }
    updateData(newData).then((res) => {
      if (res) setData(newData);
    });
  };

  const updateAffirmation = (text) => {
    const newData = data.map((item, index) =>
      index === currentIndex ? text : item
    );
    updateData(newData).then((res) => {
      if (res) setData(newData);
    });
  };

  const deleteAffirmation = () => {
    const newData = data.filter((_, index) => index !== currentIndex);
    updateData(newData).then((res) => {
      if (res) setData(newData);
    });
  };

  return (
    <myContext.Provider
      value={{
        resize: resizeValue,
        data,
        setData,
        currentIndex,
        setCurrentIndex,
        addAffirmation,
        updateAffirmation,
        deleteAffirmation,
      }}
    >
      {children}
    </myContext.Provider>
  );
};
