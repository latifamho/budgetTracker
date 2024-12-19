"use client";
import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/skeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GEtFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}
const CategoriesStats = ({ from, to, userSettings }: Props) => {
  const statsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });
  const formatter = useMemo(() => {
    return GEtFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className=" flex w-full flex-wrap md:flex-nowrap gap-2">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
};

export default CategoriesStats;

function CategoriesCard({
  data,
  type,
  formatter,
}: {
  type: TransactionType;
  formatter: Intl.NumberFormat;
  data: GetCategoriesStatsResponseType;
}) {
  const filterData = data.filter((el) => el.type === type);
  const total = filterData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0);

  return (
    <Card className=" h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="  grid grid-flow-row justify-between gap-2  text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Incomes" : "Expenses"}
        </CardTitle>
      </CardHeader>
      <div className="  flex items-center justify-between gap-2   ">
        {filterData.length === 0 && (
          <div className=" flex h-60 w-full flex-col items-center justify-center">
            No data for the selected period
            <p className=" text-sm text-muted-foreground ">
              Try selecting a different period or try adding new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}
        {filterData.length > 0 && (
          <ScrollArea
            className=" h-60 w-full ox4
        "
          >
            <div className=" flex w-full flex-col gap-4 p-4">
              {filterData.map((item) => {
                const amount = item._sum.amount || 0;
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={item.category} className=" flex flex-col gap-2">
                    <div className=" flex items-center justify-between">
                      <span className=" flex items-center text-gray-400">
                        {item.categoryIcon}
                        {item.category}
                        <span className=" ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="  text-sm text-gray-400 ">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-rose-500"
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}