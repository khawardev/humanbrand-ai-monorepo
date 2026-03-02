'use client';

import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormValues {
    url: string;
    competitor1?: string;
    competitor2?: string;
    competitor3?: string;
}

interface UrlSubmissionFormProps {
    onSubmit: (url: string, competitors: string[]) => void;
    setIsLoading: (url: boolean) => void;
    isLoading: boolean;
}

export default function UrlSubmissionForm({
    onSubmit,
    isLoading,
    setIsLoading
}: UrlSubmissionFormProps) {
    const form = useForm<FormValues>({
        defaultValues: { 
            url: '',
            competitor1: '',
            competitor2: '',
            competitor3: ''
        },
        mode: 'onChange'
    });

    const handleFormSubmit = async (data: FormValues) => {
        setIsLoading(true);
        const competitors = [data.competitor1, data.competitor2, data.competitor3].filter(Boolean) as string[];
        onSubmit(data.url, competitors);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleFormSubmit)}
                className="flex flex-col gap-4 max-w-2xl mx-auto"
            >
                <div className="flex flex-col sm:flex-row gap-2">
                    <FormField
                        control={form.control}
                        name="url"
                        rules={{
                            required: 'Brand URL is required.',
                            pattern: {
                                value: new RegExp('^(https?|ftp)://[^\\s/$.?#].[^\\s]*$'),
                                message: 'Please enter a valid website URL.'
                            }
                        }}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        type="url"
                                        placeholder="https://www.yourbrand.com"
                                        className="h-10 text-center rounded-full sm:text-left"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full font-semibold sm:w-auto"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="size-3 animate-spin" />}
                        Start Audit
                    </Button>
                </div>

                {!isLoading && (
                    <div className="space-y-3 p-4 border rounded-2xl bg-muted/50">
                        <h3 className="text-sm font-medium px-1">Add Competitors (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[1, 2, 3].map((i) => (
                                <FormField
                                    key={i}
                                    control={form.control}
                                    name={`competitor${i}` as keyof FormValues}
                                    rules={{
                                        pattern: {
                                            value: new RegExp('^(https?|ftp)://[^\\s/$.?#].[^\\s]*$'),
                                            message: 'Invalid URL.'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    type="url"
                                                    placeholder={`Competitor ${i} URL`}
                                                    className="h-9 text-sm rounded-xl"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground px-1 italic">
                            Adding competitors allows us to capture comparative data for a better health report.
                        </p>
                    </div>
                )}
            </form>
        </Form>
    );
}
