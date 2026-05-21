import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWithToken } from "../api/apiutils";

export const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);

        const res = await fetchWithToken("/api/v1/tests");

        if (!res.ok) {
          throw new Error("Failed to fetch tests");
        }

        const data = await res.json();

        // ожидаем формат: { tests: [...] }
        setTests(data.tests || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading tests...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <h1 className="mb-12 text-center text-3xl font-normal">
        Choose which test you want to start
      </h1>

      <section
        className="
          grid justify-center gap-y-10
          sm:grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-x-10 lg:gap-x-[70px]
        "
      >
        {tests.map((test: any) => (
          <NavLink
            key={test.id}
            to={`/tests/${test.id}/intro`}
            className="group flex max-w-[260px] flex-col items-center text-center"
          >
            <div className="mb-2 w-full max-w-[250px] aspect-square overflow-hidden rounded-[38px] bg-[#f6f3eb]">
              <img
                src={test.image_src}
                alt={test.image_alt}
                className={`h-full w-full transition-transform group-hover:-translate-y-1 object-contain`}
              />
            </div>

            <h2 className="text-xl font-normal transition-colors group-hover:text-[#8b6c00]">
              {test.title}
            </h2>

            <p className="mt-2 text-sm font-light leading-[18px] text-gray-600">
              {test.description}
            </p>
          </NavLink>
        ))}
      </section>
    </div>
  );
};
