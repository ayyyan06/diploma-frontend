import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../../api/apiutils";

const toneColors: any = {
  duration: "bg-[#FFF9E8]",
  format: "bg-[#F7F4FF]",
  result: "bg-[#EEF8FF]",
};

export const TestIntroPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTest = async () => {
      try {
        setLoading(true);

        const res = await fetchWithToken(`/api/v1/tests/${id}`);
        const resJson = await res.json();

        setTest(resJson);
      } catch (error) {
        console.error("Ошибка загрузки теста:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadTest();
    }
  }, [id]);

  const handleStart = () => {
    navigate(`/tests/${id}`);
  };

  if (loading) {
    return (
      <main className="mt-[74px] mx-[110px]">
        <p className="text-[20px] font-medium">Loading...</p>
      </main>
    );
  }

  if (!test) {
    return (
      <main className="mt-[74px] mx-[110px]">
        <p className="text-[20px] font-medium">Test not found</p>
      </main>
    );
  }

  return (
    <main className="mt-[74px] mx-[110px] mb-[150px]">
      <section
        className="
          w-[1220px]
          min-h-[580px]
          box-border
          border-2
          border-[#ECE7DD]
          rounded-[28px]
          bg-white
          flex
          justify-between
          items-center
          pt-[62px]
          pr-[103px]
          pb-[68px]
          pl-[50px]
        "
      >
        <div className="w-[580px]">
          <p
            className="
              m-0
              mb-[20px]
              text-[14px]
              font-normal
              leading-[18px]
              text-[#7A7A7A]
              uppercase
            "
          >
            Step 1 · Before you begin
          </p>

          <h1
            className="
              m-0
              mb-[31px]
              text-[40px]
              font-bold
              leading-[50px]
              text-[#111111]
            "
          >
            {test.title}
          </h1>

          <p
            className="
              m-0
              mb-[63px]
              w-[595px]
              text-[16px]
              font-normal
              leading-[26px]
              text-[#444444]
            "
          >
            {test.description}
          </p>

          <div className="flex gap-[20px] mb-[54px]">
            {test.info_boxes?.map((box: any, index: any) => (
              <div
                key={index}
                className={`
                  w-[180px]
                  h-[116px]
                  rounded-[18px]
                  pt-[18px]
                  pr-[17px]
                  pb-[38px]
                  pl-[16px]
                  box-border
                  ${toneColors[box.tone] || "bg-[#F5F5F5]"}
                `}
              >
                <h3
                  className="
                    m-0
                    mb-[9px]
                    text-[22px]
                    font-bold
                    leading-[28px]
                    text-[#111111]
                  "
                >
                  {box.value}
                </h3>

                <p
                  className="
                    m-0
                    text-[18px]
                    font-normal
                    leading-[23px]
                    text-[#555555]
                  "
                >
                  {box.label}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="
              w-[230px]
              h-[58px]
              border-none
              rounded-[12px]
              bg-[#F2B705]
              text-white
              text-[16px]
              font-bold
              leading-[20px]
              cursor-pointer
              transition-all
              duration-200
              hover:opacity-90
            "
          >
            START TEST
          </button>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={test.image_src}
            alt={test.image_alt}
            className="block w-[420px] object-contain"
          />
        </div>
      </section>
    </main>
  );
};
