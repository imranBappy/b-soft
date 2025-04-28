"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
type SliderProps = React.ComponentProps<typeof Slider>

type FilterProps = {
    className?: string;
    cardClassName?: string;

    name: string;
    rangeState: [number, React.Dispatch<React.SetStateAction<number>>];
} & SliderProps;

const RangeFilter = ({ rangeState, name, className,cardClassName, ...props }: FilterProps) => {
    const [range, setRange] = rangeState
    return (
        <Card className={`w-72  rounded ${cardClassName}`}>
            <CardHeader className="px-4 py-4 dark:bg-primary-foreground   bg-gray-light  text-primary-background">
                <CardTitle className=" flex justify-between font-playfair font-bold text-base">
                    <span>{name}</span>
                    <span className=" font-playfair font-normal">{range}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-8">
                <Slider
                    onValueChange={(values) => setRange(values[0])}
                    defaultValue={[range]}
                    max={5000}
                    step={1}
                    className={cn('w-[100%]', className)}
                    {...props}
                />
            </CardContent>
        </Card>
    );
};

export default RangeFilter;