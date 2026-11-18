# Agent workflow على Claude Code

**Live site:** https://abdallahmohamed220.github.io/portfolio/

## التركيب
انسخ `CLAUDE.md` وفولدر `.claude/` في root المشروع بتاعك (لو عندك `CLAUDE.md` قبل كده، ضيف محتواه عليه).

## الاستخدام
```
claude
> /task عاوز أضيف صفحة login بالإيميل والباسورد
```

## اللي بيحصل
1. **Clarify** — Claude يسألك لحد ما يفهم، ويكتب `01-requirements.md` ويستنى موافقتك.
2. **Plan** — الـ `planner` يقسم الشغل ويحدد لكل خطوة إيجنت وسكلز، ويكتب `02-plan.md`.
3. **Route & execute** — الـ session الرئيسية توزع كل خطوة على الإيجنت بتاعها، وكل إيجنت يكتب doc لخطوته.
4. **Review** — الـ `reviewer` يراجع على الـ definition of done ويكتب `04-review.md`.
5. **Summary** — `05-summary.md` فيه كل اللي اتعمل.

كل الـ docs بتتحط في `docs/<task-id>/`.

## إضافة إيجنت جديد
اعمل ملف في `.claude/agents/` (أو استخدم `/agents` جوه Claude Code). أهم حاجة الـ `description`،
لأن الـ planner بيختار الإيجنت على أساسه. أول ما الملف يتحط، الـ planner هيشوفه تلقائياً.

## إضافة سكل جديد
فولدر جديد في `.claude/skills/<name>/` فيه `SKILL.md` بـ `name` و `description`،
واكتب اسم السكل في الـ planner أو الإيجنت اللي هيستخدمه.
