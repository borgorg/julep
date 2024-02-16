import json
from uuid import UUID


def search_functions_by_embedding_query(
    agent_id: UUID,
    query_embedding: list[float],
    k: int = 3,
    confidence: float = 0.8,
):
    agent_id = str(agent_id)
    radius: float = 1.0 - confidence

    return f"""
        input[
            agent_id,
            query_embedding,
        ] <- [[
            to_uuid("{agent_id}"),
            vec({json.dumps(query_embedding)}),
        ]]

        candidate[
            tool_id
        ] := input[agent_id, _],
            *agent_functions {{
                agent_id,
                tool_id
            }}

        ?[
            agent_id,
            tool_id,
            name,
            description,
            parameters,
            updated_at,
            created_at,
            distance,
            vector,
        ] := input[agent_id, query_embedding],
            candidate[tool_id],
            ~agent_functions:embedding_space {{
                agent_id,
                tool_id,
                name,
                description,
                parameters,
                updated_at,
                created_at |
                query: query_embedding,
                k: {k},
                ef: 128,
                radius: {radius},
                bind_distance: distance,
                bind_vector: vector,
            }}

        :sort distance
    """