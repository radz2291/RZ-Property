import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getSiteContent } from "@/lib/actions/site-content"
import { FAQItem } from "@/lib/actions/site-content"

export default async function FAQ() {
  const faqContent = await getSiteContent("faq") || {
    title: "Frequently Asked Questions",
    data: [
      {
        question: "How do I schedule a property viewing?",
        answer: "You can schedule a viewing by contacting RZ Amin directly through the contact form on any property listing, or by calling the provided phone number. Alternatively, you can send a message via WhatsApp for a quick response."
      },
      {
        question: "What areas in Tawau do you cover?",
        answer: "We cover all residential and commercial areas in Tawau, including Taman Megah, Fajar, Taman Sri, Bukit, and surrounding districts. Our extensive local knowledge ensures we can help you find properties in your preferred location."
      },
      {
        question: "How quickly can I move into a rental property?",
        answer: "The timeline depends on the property's current status and the completion of necessary paperwork. Typically, you can move in within 2-4 weeks after signing the rental agreement and paying the required deposits. For properties marked as \"Ready to Move In,\" the process can be expedited."
      },
      {
        question: "What documents do I need when buying a property?",
        answer: "When purchasing a property, you'll need identification documents (IC/passport), proof of income (salary slips or tax returns), bank statements, and sometimes a letter of employment. For financing, additional documents may be required by your bank or financial institution. We can guide you through the entire documentation process."
      },
      {
        question: "Do you help with property financing?",
        answer: "While we don't provide financing directly, we can connect you with trusted financial advisors and banks that offer competitive mortgage rates. We can also help you understand the financing options available for different property types and guide you through the loan application process."
      }
    ]
  }

  const { title, data } = faqContent
  const faqs = Array.isArray(data) ? data : []

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq: FAQItem, index: number) => (
          <AccordionItem key={`faq-${index}`} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
