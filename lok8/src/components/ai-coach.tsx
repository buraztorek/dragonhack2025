"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X } from 'lucide-react';
import { getGeminiResponse } from "@/lib/gemini-client";

interface Message {
    role: 'user' | 'ai';
    text: string;
}

interface AiCoachProps {
    sessionSummary?: string;
    autoOpen?: boolean;
}

const AiCoach: React.FC<AiCoachProps> = ({ sessionSummary, autoOpen }) => {
    const [isOpen, setIsOpen] = useState(autoOpen || false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (sessionSummary) {
            setIsOpen(true);
            handleSendMessage(sessionSummary, true);
        }
    }, [sessionSummary]);

    const handleSendMessage = async (text: string, isSystem?: boolean) => {
        const userMessage: Message = { role: 'user', text };
        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const prompt = isSystem ? text : `Answer like a skater named Ollie: ${text}`;
            const aiText = await callGeminiApi(prompt);
            const aiMessage: Message = { role: 'ai', text: aiText };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Gemini API error:", error);
            setMessages((prev) => [...prev, { role: 'ai', text: "Yo, something went wrong. Try again in a sec." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const callGeminiApi = async (prompt: string): Promise<string> => {
        return await getGeminiResponse(prompt);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-white rounded-full shadow-xl border-2 border-black hover:scale-105 transition-all flex items-center justify-center p-1"
                >
                    <img
                        src="/ollie-ai.png"
                        alt="Open Ollie Chat"
                        className="w-full h-full object-contain rounded-full"
                    />
                </button>
            )}


            {isOpen && (
                <div className="w-80 h-[500px] bg-white border rounded-2xl shadow-2xl flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h4 className="font-bold text-lg flex items-center gap-2">
                            <img src="/ollie-ai.png" alt="Ollie Avatar" className="w-6 h-6 rounded-full" />
                            Ollie the Coach
                        </h4>
                        <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                    </div>
                    <ScrollArea className="flex-1 p-3 space-y-3 overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-2 ${msg.role === 'ai' ? 'flex-row' : 'flex-row-reverse'
                                    }`}
                            >
                                {msg.role === 'ai' && (
                                    <img src="/ollie-ai.png" alt="Ollie Avatar" className="w-8 h-8 rounded-full mt-1" />
                                )}
                                <div
                                    className={`p-2 mb-3 rounded-xl text-sm max-w-[75%] ${msg.role === 'user' ? 'bg-gray-200' : 'bg-blue-100'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-gray-500 text-sm ml-2">Ollie’s thinking…</div>
                        )}
                    </ScrollArea>
                    <div className="p-3 border-t flex gap-2">
                        <Textarea
                            className="flex-1 resize-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Ollie anything..."
                        />
                        <Button
                            onClick={() => {
                                if (input.trim()) {
                                    handleSendMessage(input);
                                    setInput('');
                                }
                            }}
                        >Send</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AiCoach;
