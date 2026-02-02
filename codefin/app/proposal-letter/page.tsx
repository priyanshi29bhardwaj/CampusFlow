"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Send } from "lucide-react"
import jsPDF from "jspdf"

export default function ProposalLetterPage() {
  const [formData, setFormData] = useState({
    eventName: "",
    clubName: "",
    description: "",
    date: "",
    expectedAttendees: "",
  })

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin

    // Header
    doc.setFontSize(16)
    doc.text("PROPOSAL LETTER TO DEAN OF STUDENT WELFARE", margin, yPosition)
    yPosition += 10

    // Date
    doc.setFontSize(11)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition)
    yPosition += 15

    // Recipient
    doc.text("To,", margin, yPosition)
    yPosition += 7
    doc.text("Dean of Student Welfare (DSW)", margin, yPosition)
    yPosition += 7
    doc.text("Sharda University", margin, yPosition)
    yPosition += 15

    // Salutation
    doc.text("Dear Sir/Madam,", margin, yPosition)
    yPosition += 15

    // Body
    doc.setFontSize(10)
    const bodyText = `We hereby submit a formal proposal for organizing an event titled "${formData.eventName}" under ${formData.clubName}.

Event Details:
• Event Name: ${formData.eventName}
• Club: ${formData.clubName}
• Date: ${formData.date}
• Expected Attendees: ${formData.expectedAttendees}

Description:
${formData.description}

We request your approval for this event and assure you that all guidelines and safety protocols will be strictly followed. We are committed to making this a successful and enriching experience for all participants.

Looking forward to your favorable consideration and approval.`

    const splitText = doc.splitTextToSize(bodyText, pageWidth - 2 * margin)
    doc.text(splitText, margin, yPosition)
    yPosition += splitText.length * 5 + 15

    // Closing
    doc.text("Sincerely,", margin, yPosition)
    yPosition += 15
    doc.text("[Club President Name]", margin, yPosition)
    doc.text("[Club President Roll Number]", margin, yPosition + 7)

    // Save PDF
    doc.save(`${formData.eventName}-proposal.pdf`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Proposal Letter to DSW</h1>
        <p className="text-muted-foreground">Generate and submit proposal letters for event approval</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Proposal Form */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Generate Proposal Letter</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Event Name</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg"
                  placeholder="Annual Tech Conference"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Club Name</label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg"
                  placeholder="IEEE Student Chapter"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg resize-none"
                  rows={5}
                  placeholder="Describe your event..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Attendees</label>
                  <input
                    type="number"
                    name="expectedAttendees"
                    value={formData.expectedAttendees}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-background text-foreground border border-input rounded-lg"
                    placeholder="500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={generatePDF}
                  disabled={!formData.eventName || !formData.clubName || !formData.date}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </Button>
                <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center justify-center gap-2">
                  <Send size={18} />
                  Send to DSW
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-card text-card-foreground border border-border rounded-lg p-8">
            <h3 className="font-bold mb-4">Preview</h3>
            <div className="bg-background text-foreground p-8 rounded-lg border border-border space-y-4 text-sm">
              <p className="font-semibold">PROPOSAL LETTER</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>To,</p>
              <p>Dean of Student Welfare (DSW)</p>
              <p className="mt-4">Dear Sir/Madam,</p>
              <p>
                We hereby submit a formal proposal for organizing an event titled "
                {formData.eventName || "[Event Name]"}" under {formData.clubName || "[Club Name]"}...
              </p>
              <p className="mt-4">Looking forward to your approval.</p>
              <p>Sincerely,</p>
              <p>[Club President Name]</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-secondary text-secondary-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-2">Required Documents</h3>
            <ul className="text-sm space-y-2">
              <li>✓ Club Charter</li>
              <li>✓ Office Bearers List</li>
              <li>✓ Event Budget</li>
              <li>✓ Risk Assessment</li>
            </ul>
          </div>

          <div className="bg-accent text-accent-foreground border border-border rounded-lg p-6">
            <h3 className="font-bold mb-2">Process Timeline</h3>
            <ol className="text-sm space-y-2">
              <li>1. Submit Proposal (7 days before)</li>
              <li>2. DSW Review (3 days)</li>
              <li>3. Approval/Revision</li>
              <li>4. Event Execution</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
