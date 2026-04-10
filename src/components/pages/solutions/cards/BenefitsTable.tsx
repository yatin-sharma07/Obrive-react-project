import FONTS from "@/assets/fonts";
import { BENEFITS_TABLE } from "@/constants/pages/solutions/workflow-steps";

const BenefitsTable = () => {
  return (
    <div className="w-full">
      <div className="hidden md:inline-block">
        <div className="bg-white border border-zinc-300 rounded-lg shadow-sm overflow-hidden">
          <table className="w-[700px]">
            <thead className="border-b border-zinc-300">
              <tr>
                <th
                  className={`text-left px-6 py-3 font-semibold text-sm text-gray-800 border-r border-zinc-300 ${FONTS.microgrammaBold.className}`}
                >
                  Benefit
                </th>
                <th
                  className={`text-left px-6 py-3 font-semibold text-sm text-gray-800 ${FONTS.microgrammaBold.className}`}
                >
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              {BENEFITS_TABLE.map((item) => (
                <tr
                  key={item.benefit}
                  className="border-b border-zinc-300 last:border-b-0"
                >
                  <td className="align-top w-[170px] px-6 py-4 border-r border-zinc-300">
                    <div className={`text-sm ${FONTS.microgrammaBold.className}`}>
                      {item.benefit}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {item.description}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {BENEFITS_TABLE.map((item) => (
          <div
            key={item.benefit}
            className="bg-white border border-zinc-300 rounded-lg shadow-sm overflow-hidden"
          >
            <div className={`border-b border-zinc-300 px-4 py-3 text-sm text-gray-800 ${FONTS.microgrammaBold.className}`}>
              {item.benefit}
            </div>
            <div className="px-4 py-3">
              <div className="text-xs text-gray-600 leading-relaxed">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsTable;
