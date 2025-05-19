import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getSiteContent } from "@/lib/actions/site-content"
import { FAQItem } from "@/lib/actions/site-content"

export default async function FAQ() {
  const faqContent = await getSiteContent("faq") || {
    title: "Frequently Asked Questions",
    data: [
      {
        question: "How do I schedule a property viewing?",
        answer: "You can schedule a viewing by contacting me directly through the contact form on any property listing, or by calling +60 11-6362 4997. For quick responses, send a WhatsApp message and I'll typically get back to you within hours to arrange a convenient viewing time."
      },
      {
        question: "What areas in Tawau do you cover?",
        answer: "I cover all residential and commercial areas in Tawau, including Taman Megah, Fajar, Taman Sri, Bukit, and surrounding districts like Balung and Merotai. My expertise extends to both urban properties near the town center and more suburban options with larger land areas."
      },
      {
        question: "How quickly can I move into a rental property?",
        answer: "For rental properties in Tawau, you can typically move in within 2-3 weeks after signing the rental agreement and paying the required deposits. Many landlords in Tawau require a 2-month security deposit plus half-month utility deposit. For properties marked as \"Ready to Move In,\" we can often expedite the process to under 10 days."
      },
      {
        question: "What documents do I need when buying a property?",
        answer: "For property purchases in Tawau, you'll need your IC/passport, 3 months of bank statements, 3 months of salary slips, EA/BE form or tax returns, and employment confirmation letter. If applying for a bank loan, additional documentation may be required. I can help you prepare the complete documentation package and connect you with legal professionals for the Sales & Purchase Agreement."
      },
      {
        question: "Do you help with property financing?",
        answer: "Yes, I work closely with several local banks in Tawau to help my clients secure the best financing rates. While I don't provide financing directly, I can introduce you to trusted loan officers who understand the Tawau property market and can offer competitive mortgage packages, especially for first-time buyers. I'll guide you through the entire loan application process."
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
